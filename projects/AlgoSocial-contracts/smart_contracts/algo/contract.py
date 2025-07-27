from algopy import ARC4Contract, arc4, BoxMap, GlobalState, Bytes, UInt64, Address, Txn, itxn, asset

# Constants
ASSET_ID = 123456  # Replace with actual ASA ID for tipping
REWARD_PER_UPVOTE = 10  # Reward in ASA for each upvote

class SocialMediaContract(ARC4Contract):
    def __init__(self) -> None:
        # Track content (content_id => hash)
        self.content = BoxMap(Bytes, Bytes, key_prefix=b"content_")
        
        # Track upvotes (content_id => count)
        self.upvotes = BoxMap(Bytes, UInt64, key_prefix=b"upvotes_")

        # Track downvotes (content_id => count)
        self.downvotes = BoxMap(Bytes, UInt64, key_prefix=b"downvotes_")

        # Track who voted on what (user_addr:content_id => True)
        self.voted = BoxMap(Bytes, UInt64, key_prefix=b"voted_")

        # Track tips to users (user => total tipped)
        self.tips_received = BoxMap(Address, UInt64, key_prefix=b"tips_")

        # Track reputation score (user => score)
        self.reputation = BoxMap(Address, UInt64, key_prefix=b"rep_")

        # Global: total posts
        self.total_posts = GlobalState(UInt64)
        @arc4.abimethod
    def post_content(self, content_id: Bytes, content_hash: Bytes) -> None:
        return (
            self.content[content_id].set(content_hash),
            self.upvotes[content_id].set(UInt64(0)),
            self.downvotes[content_id].set(UInt64(0)),
            self.total_posts.increment(),
            self.reputation[Txn.sender()].increment(5)  # Posting increases reputation
        )
        @arc4.abimethod
    def vote(self, content_id: Bytes, is_upvote: UInt64) -> None:
        # Unique vote key: sender + content_id
        vote_key = Txn.sender().bytes() + content_id

        return (
            (self.voted[vote_key].get() == UInt64(0)).assert_(),
            self.voted[vote_key].set(UInt64(1)),
            (is_upvote == UInt64(1)).if_then_else(
                self.upvotes[content_id].increment(),
                self.downvotes[content_id].increment()
            ),
            self.reputation[Txn.sender()].increment(1)  # Voting gives minor rep
        )
    @arc4.abimethod
    def tip_creator(self, receiver: Address, amount: UInt64) -> None:
        return (
            (amount > UInt64(0)).assert_(),
            self.tips_received[receiver].increment(amount),
            itxn.AssetTransfer(
                xfer_asset=ASSET_ID,
                asset_amount=amount,
                receiver=receiver
            ).submit()
        )

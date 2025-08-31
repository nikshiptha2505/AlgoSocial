from algopy import ARC4Contract, arc4, BoxMap, GlobalState, Bytes, UInt64, Address, Txn, itxn, asset

# Constants
ASSET_ID = 123456  # Replace with actual ASA ID for tipping
REWARD_PER_UPVOTE = 10  # Reward in ASA for each upvote
DOWNVOTE_THRESHOLD = 5  # Auto-hide content if downvotes >= threshold

class SocialMediaContract(ARC4Contract):
    def __init__(self) -> None:
        # Content (content_id => hash)
        self.content = BoxMap(Bytes, Bytes, key_prefix=b"content_")

        # Content creator (content_id => creator address)
        self.creators = BoxMap(Bytes, Address, key_prefix=b"creator_")

        # Upvotes & Downvotes
        self.upvotes = BoxMap(Bytes, UInt64, key_prefix=b"upvotes_")
        self.downvotes = BoxMap(Bytes, UInt64, key_prefix=b"downvotes_")

        # Track who voted on what
        self.voted = BoxMap(Bytes, UInt64, key_prefix=b"voted_")

        # Tips
        self.tips_received = BoxMap(Address, UInt64, key_prefix=b"tips_")

        # Reputation
        self.reputation = BoxMap(Address, UInt64, key_prefix=b"rep_")

        # Comments (comment_id => content_id + hash)
        self.comments = BoxMap(Bytes, Bytes, key_prefix=b"comment_")
        self.comment_authors = BoxMap(Bytes, Address, key_prefix=b"commenter_")

        # Global tracking
        self.total_posts = GlobalState(UInt64)
        self.total_comments = GlobalState(UInt64)

    # -------- Content Posting --------
    @arc4.abimethod
    def post_content(self, content_id: Bytes, content_hash: Bytes) -> None:
        return (
            self.content[content_id].set(content_hash),
            self.creators[content_id].set(Txn.sender()),
            self.upvotes[content_id].set(UInt64(0)),
            self.downvotes[content_id].set(UInt64(0)),
            self.total_posts.increment(),
            self.reputation[Txn.sender()].increment(5)  # Posting increases reputation
        )

    # -------- Voting System --------
    @arc4.abimethod
    def vote(self, content_id: Bytes, is_upvote: UInt64) -> None:
        vote_key = Txn.sender().bytes() + content_id

        return (
            (self.voted[vote_key].get() == UInt64(0)).assert_(),  # Prevent double voting
            self.voted[vote_key].set(UInt64(1)),
            (is_upvote == UInt64(1)).if_then_else(
                (
                    self.upvotes[content_id].increment(),
                    self.reputation[Txn.sender()].increment(1),
                    # Reward creator
                    itxn.AssetTransfer(
                        xfer_asset=ASSET_ID,
                        asset_amount=UInt64(REWARD_PER_UPVOTE),
                        receiver=self.creators[content_id].get()
                    ).submit(),
                    self.tips_received[self.creators[content_id].get()].increment(REWARD_PER_UPVOTE),
                    self.reputation[self.creators[content_id].get()].increment(2)  # Creator gains rep
                ),
                (
                    self.downvotes[content_id].increment(),
                    self.reputation[self.creators[content_id].get()].decrement(1)  # Reputation penalty on downvote
                )
            )
        )

    # -------- Tipping System --------
    @arc4.abimethod
    def tip_creator(self, receiver: Address, amount: UInt64) -> None:
        return (
            (amount > UInt64(0)).assert_(),
            self.tips_received[receiver].increment(amount),
            self.reputation[receiver].increment(amount // 10),  # Tipping boosts reputation
            itxn.AssetTransfer(
                xfer_asset=ASSET_ID,
                asset_amount=amount,
                receiver=receiver
            ).submit()
        )

    # -------- Comments --------
    @arc4.abimethod
    def add_comment(self, comment_id: Bytes, content_id: Bytes, comment_hash: Bytes) -> None:
        return (
            self.comments[comment_id].set(comment_hash),
            self.comment_authors[comment_id].set(Txn.sender()),
            self.total_comments.increment(),
            self.reputation[Txn.sender()].increment(2)  # Commenting gives reputation
        )

    # -------- Content Removal (Creator/Admin only) --------
    @arc4.abimethod
    def remove_content(self, content_id: Bytes) -> None:
        return (
            (Txn.sender() == self.creators[content_id].get()).assert_(),  # Only creator can remove
            self.content[content_id].delete(),
            self.upvotes[content_id].delete(),
            self.downvotes[content_id].delete(),
            self.creators[content_id].delete()
        )

    # -------- Get Leaderboard Score --------
    @arc4.abimethod(readonly=True)
    def get_reputation(self, user: Address) -> UInt64:
        return self.reputation[user].get()

    # -------- Check Content Status --------
    @arc4.abimethod(readonly=True)
    def is_hidden(self, content_id: Bytes) -> UInt64:
        # Returns 1 if hidden, else 0
        return (self.downvotes[content_id].get() >= UInt64(DOWNVOTE_THRESHOLD)).if_then_else(UInt64(1), UInt64(0))

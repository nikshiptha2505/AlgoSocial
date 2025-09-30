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

        # Track who voted on what (voter_address + content_id)
        self.voted = BoxMap(Bytes, UInt64, key_prefix=b"voted_")

        # Tips and reputation
        self.tips_received = BoxMap(Address, UInt64, key_prefix=b"tips_")
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
        if not content_id or not content_hash:
            return  # Reject invalid input

        self.content[content_id].set(content_hash)
        self.creators[content_id].set(Txn.sender())
        self.upvotes[content_id].set(UInt64(0))
        self.downvotes[content_id].set(UInt64(0))
        self.total_posts.increment()
        self.reputation[Txn.sender()].increment(5)  # Posting increases reputation

    # -------- Voting System --------
    @arc4.abimethod
    def vote(self, content_id: Bytes, is_upvote: UInt64) -> None:
        if content_id not in self.content:
            return  # Reject voting on nonexistent content

        vote_key = Txn.sender().bytes() + content_id
        if self.voted[vote_key].get() != UInt64(0):
            return  # Prevent double voting

        self.voted[vote_key].set(UInt64(1))

        creator = self.creators[content_id].get()
        if is_upvote == UInt64(1):
            self.upvotes[content_id].increment()
            self.reputation[Txn.sender()].increment(1)
            # Reward creator
            itxn.AssetTransfer(
                xfer_asset=ASSET_ID,
                asset_amount=UInt64(REWARD_PER_UPVOTE),
                receiver=creator
            ).submit()
            self.tips_received[creator].increment(REWARD_PER_UPVOTE)
            self.reputation[creator].increment(2)
        else:
            self.downvotes[content_id].increment()
            self.reputation[creator].decrement(1)  # Reputation penalty on downvote

    # -------- Tipping System --------
    @arc4.abimethod
    def tip_creator(self, receiver: Address, amount: UInt64) -> None:
        if amount <= UInt64(0):
            return

        self.tips_received[receiver].increment(amount)
        self.reputation[receiver].increment(amount // 10)  # Tipping boosts reputation

        itxn.AssetTransfer(
            xfer_asset=ASSET_ID,
            asset_amount=amount,
            receiver=receiver
        ).submit()

    # -------- Comments --------
    @arc4.abimethod
    def add_comment(self, comment_id: Bytes, content_id: Bytes, comment_hash: Bytes) -> None:
        if not comment_id or not content_id or not comment_hash:
            return

        self.comments[comment_id].set(comment_hash)
        self.comment_authors[comment_id].set(Txn.sender())
        self.total_comments.increment()
        self.reputation[Txn.sender()].increment(2)

    # -------- Content Removal (Creator/Admin only) --------
    @arc4.abimethod
    def remove_content(self, content_id: Bytes) -> None:
        if Txn.sender() != self.creators[content_id].get():
            return  # Only creator can remove

        self.content[content_id].delete()
        self.upvotes[content_id].delete()
        self.downvotes[content_id].delete()
        self.creators[content_id].delete()

    # -------- Get Leaderboard Score --------
    @arc4.abimethod(readonly=True)
    def get_reputation(self, user: Address) -> UInt64:
        return self.reputation.get(user, UInt64(0))

    # -------- Check Content Status --------
    @arc4.abimethod(readonly=True)
    def is_hidden(self, content_id: Bytes) -> UInt64:
        return UInt64(1) if self.downvotes.get(content_id, UInt64(0)) >= UInt64(DOWNVOTE_THRESHOLD) else UInt64(0)

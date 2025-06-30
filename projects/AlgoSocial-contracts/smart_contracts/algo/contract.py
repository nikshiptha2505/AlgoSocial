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

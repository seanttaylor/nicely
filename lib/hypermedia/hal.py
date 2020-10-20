from lib.hypermedia.hal_root import hal_root;
from lib.hypermedia.hal_feed_posts import feed_posts;
from lib.hypermedia.hal_user_posts import user_post;

curie_map = {
    "feed:posts": feed_posts,
    "user:post": user_post
}

class HALHyperMediaService():
    api_root = hal_root;

    def __init__(self):
        pass;

    def toHAL(self, curie, data):
        doc = curie_map[curie](data);
        return doc;

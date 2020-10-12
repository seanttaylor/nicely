class FeedService():

    def __init__(self, PostService, PublishService, event_emitter):
        """
        @param (object) self
        @param (PostService) PostService - an instance of the PostService class
        @param (PublishService) PublishService - an instance of the PublishService class
        @param (event_emitter) event_emitter - an implementation of the IEventEmitter interface
        @return (None)
        """
        self._PostService = PostService;
        self._PublishService = PublishService;
        self._event_emitter = event_emitter;

        self._event_emitter.on("Posts.NewPostReadyToPublish", self.on_post_marked_as_published);


    def replay_posts(self, sequence_no, batch_size=25):
        """
        Fetches a batch of published posts from the PostService in reverse chronological order
        @param (object) self
        @param (int) sequence_no - the lowest sequence_no in the batch request (i.e. the lower limit on the oldest posts returned)
        @returns (None)
        """
        ending_sequence_no = sequence_no;
        starting_sequence_no = self._PostService.get_total_post_count();


        while starting_sequence_no != ending_sequence_no:
            result = self._PostService.get_batch_by_sequence_no(
                starting_with=starting_sequence_no,
                ending_with=ending_sequence_no,
                batch_size=batch_size
            );

        starting_sequence_no = starting_sequence_no - len(result);
        yield result;


    def get_recent_posts(self):
        """
        Fetches the (35) most recently published posts
        @param (object) self
        @returns (list)
        """

        return self._PostService.get_recent_posts();


    def publish_post(self, post):
        """
        Publishes a post to the main feed
        @param (object) self
        @param (Post) post - an instance of the Post class
        @returns (None)
        """
        self._PublishService.publish(post);


    def on_post_marked_as_published(self, event_data):
        """
        Publishes a post to the main feed in response to a post recently marked for publishing
        @param (object) self
        @param (ApplicationEventData) event_data - an instance of the ApplicationEventData class
        @returns (None)
        """
        self._PublishService.publish(event_data.value());


    def get_feed_of(self, user):
        """
        Returns a list of posts from all users a specified user is following
        @param (object) self
        @param (User) user - an instance of the User class
        @return (list)
        """
        return self._PostService.get_posts_by_subscriber(user._id);




####FeedService####





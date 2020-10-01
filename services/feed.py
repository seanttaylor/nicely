
class FeedService():

  # Manages `Posts` on the Main Feed

    def __init__(self, PostService):
        self._PostService = PostService;
        pass;


    def get_posts(self, offset):
        current_offset = offset;
        ending_sequence_no = self._PostService.get_total_post_count();

        print(ending_sequence_no);

        while current_offset < ending_sequence_no:
            result = self._PostService.get_batch_by_sequence_no(current_offset);
            current_offset = current_offset + len(result);
            yield result;









####FeedService####





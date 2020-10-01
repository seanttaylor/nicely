
class FeedService():

  # Manages `Posts` on the Main Feed

    def __init__(self, PostService):
      self._PostService = PostService;
      pass;


    def batch_get_posts(self, sequence_no, batch_size=25):
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









####FeedService####





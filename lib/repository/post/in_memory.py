from datetime import datetime;
import uuid;

# Implements IPostRepository interface for reading/writing posts to in-memory data store.
# See interfaces/post_repository for method documentation


class PostMemoryRepository():
	_store = {};

	def create(self, doc):
		my_uuid = str(uuid.uuid4());

		self._store[my_uuid] = {
		  "id": my_uuid,
		  "createdDate": str(datetime.now()),
		  "lastModified": "n/a",
		  "doc": doc
		};
		return my_uuid;


	def find_one(self, id):
		return self._store[id];


	def find_all(self):
		return self._store.values();


	def update(self, id, doc):
		self._store[id]["doc"].update(doc);
		self._store[id].update({"lastModified": str(datetime.now())});


	def incr_comment_count(self):
		pass;


	def delete(self, id):
		del self._store[id];

####PostMemoryRepository####
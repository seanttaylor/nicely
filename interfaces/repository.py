class IRepository():

  def __init__(self, myImpl): 

    self._name = "myRepo";
    self._create = myImpl.create;
    self._find_one = myImpl.find_one;
    self._find_all = myImpl.find_all;
    self._update = myImpl.update;
    self._delete = myImpl.delete;

  def create(self, doc):
    return self._create(doc);

  def find_one(self, id):
    return self._find_one(id);

  def find_all(self):
    return self._find_all();

  def update(self, id, doc):
    return self._update(id, doc);

  def delete(self, id):
    return self._delete(id);

####IRepository####
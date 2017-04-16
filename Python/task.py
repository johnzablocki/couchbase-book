from datetime import date

class Task(object):

    _id = ""
    _title = ""
    _description = ""
    _dueDate = date.today()
    _isComplete = False

    @property
    def id(self):
        return self._id 
    
    @id.setter
    def id(self, id ):
        self._id = id

    @property
    def title(self):
        return self._title 
    
    @title.setter
    def title(self, title):
        self._title = title

    
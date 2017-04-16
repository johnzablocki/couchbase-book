# Couchbase Essentials Python Apps #

The Python version of the ToDo app uses Python 3.6, with virtualenv, and flask.  Setup instructions follow.

If you have not already installed virtualenv...

```python
pip install virtualenv
```
Then create a virtual environment from the root directory of the Python sample. 

Edit the activate script found at .\ven\Scripts to include the last line

```python
export FLASK_APP=app.py
``` 

```python
virtualenv venv
cd venv
.\venv\Scripts\activate
``` 

At this point, you can install packages without affecting your global Python installation.






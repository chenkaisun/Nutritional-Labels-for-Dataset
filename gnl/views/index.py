"""
gnl index (main) view.
URLs include:
/
"""
import os
import shutil
import hashlib
import tempfile
import uuid
import flask
import pandas as pd
from flask import session
from flask import request
from flask import redirect
from flask import url_for
from flask import g
from flask import render_template
import arrow
import gnl
import numpy as np
from gnl.api import likes
from gnl.views import helper
from random import randint, uniform

# cache=[]
# inc=0
def sha1sum(filename):
    """Return sha1 hash of file content, similar to UNIX sha1sum."""
    content = open(filename, 'rb').read()
    sha1_obj = hashlib.sha1(content)
    return sha1_obj.hexdigest()

@gnl.app.route('/', methods=['GET', 'POST'])
def index():
    # cache["a"]=np.random.randint(2, size=2)
    # cache.append(1)
    # print("cache index", cache)
    # uid=request.cookies.get('YourSessionCookie')
    context = {"options":[{ "label": "1","value": "Alabama"}, { "label": "2","value": "Alabama"}]}

    return redirect(url_for('selection'))

    gnl.app.config["CURRENT_FILE"]=None
    gnl.app.config["CURRENT_IGNORED_COLUMNS"]=[]
    gnl.app.config["CURRENT_SELECTION"]={}
    gnl.app.config["CURRENT_DF"]=None
    gnl.app.config["CURRENT_COLUMN_TYPES"]=None
    gnl.app.config["CURRENT_MANUAL_INFO"]=None
    gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]=None


    session["CURRENT_LOADED"] = True
    # return render_template("selection.html")

    gnl.app.config["CURRENT_FILE"] = os.path.join(
            gnl.app.config["UPLOAD_FOLDER"],
            "RecidivismData_Original.csv"
    )

    return redirect(url_for('selection'))
    print("\n**index**\n")

    if request.method == "POST":
        print("\n**index post**\n")

        # Save POST request's file object to a temp file
        dummy, temp_filename = tempfile.mkstemp()
        print("flask.request.files:", flask.request.files)
        file_name = flask.request.files["filee"]
        file_name.save(temp_filename)

        print("file_name:",file_name)

        # Compute filename with sha256 for encoding
        hash_txt = sha1sum(temp_filename)
        dummy, suffix = os.path.splitext(file_name.filename)
        hash_filename_basename = hash_txt + suffix
        hash_filename = os.path.join(
            gnl.app.config["UPLOAD_FOLDER"],
            hash_filename_basename
        )

        # Move temp file to permanent location
        print("start moving")

        shutil.move(temp_filename, hash_filename)
        gnl.app.logger.debug("Saved %s", hash_filename_basename)
        print(hash_filename)

        # ###move csv to data folder
        # shutil.move(temp_filename, os.path.join(
        #     gnl.app.config["DATA_FOLDER"],
        #     hash_filename_basename
        # ))
        # ###

        gnl.app.config["CURRENT_FILE"] = hash_filename
        gnl.app.config["CURRENT_LOADED"] = True
        print("\n**leaving index**\n")
        return redirect(url_for('selection'))
    return render_template("index.html", **context)

@gnl.app.route('/redirection/', methods=['GET', 'POST'])
def redirection():
    print("here redirection")

    return redirect(url_for('index'))

@gnl.app.route('/selection/', methods=['GET', 'POST'])
def selection():
    print("\n**selection**\n")
    # return render_template("label.html")
    #########
    # gnl.app.config["CURRENT_FILE"] = os.path.join(
    #     gnl.app.config["UPLOAD_FOLDER"],
    #     "complete.csv"
    # )

    gnl.app.config["CURRENT_DF"]=pd.read_csv(os.path.join(
        gnl.app.config["DATA_FOLDER"],
        "numeric.csv"))
    gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"] = pd.read_csv(os.path.join(
        gnl.app.config["DATA_FOLDER"],
        "complete.csv"))
    gnl.app.config["CURRENT_COLUMN_TYPES"] = helper.find_types_of_table(gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"])
    ##########

    context={}


#     df=pd.read_csv(gnl.app.config["CURRENT_FILE"])
#
#     # standardize the column names
#     helper.normalize_colnames(df)
#
#     # clean the strings that are actually numbers and also invalid string such as those with comma and special chars, or $
#     helper.clean(df)
#     gnl.app.config["CURRENT_DF"] = df
#
#     # find types of each col for convenience
#     gnl.app.config["CURRENT_COLUMN_TYPES"] = helper.find_types_of_table(df)
#
#
# ###
#     likes.get_multi_basic()
# ###
#
#     # fill in null entries
#     gnl.app.config['CURRENT_DF']=helper.fill_na(gnl.app.config['CURRENT_DF'])
#
#     # set column that should be ignored, s.a. empty columns and str columns (for numerical computing)
#     dff=gnl.app.config["CURRENT_COLUMN_TYPES"]
#     gnl.app.config["CURRENT_IGNORED_COLUMNS"] += [col for col in list(gnl.app.config["CURRENT_DF"])
#                                                   if (dff[col][0] == "str" or dff[col][0] == "empty")]
#
#     # CURRENT_DF_WITH_IGNORED_COLUMNS is for fd and ar
#     gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]=gnl.app.config["CURRENT_DF"].copy()
#
#     # drop ignored columns and use it for non fd and ar work
#     gnl.app.config["CURRENT_DF"].drop(columns=gnl.app.config["CURRENT_IGNORED_COLUMNS"], inplace=True)
#


    print("\n**Leaving selection**\n")

    gnl.app.config["OUTPUT"]="output.json"
    gnl.app.config["MUPS"]="mups.json"
    gnl.app.config["CURRENT_SELECTION"]={'is_whole':False,
                                         'attribute_currentValues':[{"label":"violence_score"},{"label":"decile_score"},
                                                                    {"label":"juv_fel_count"},{"label":"v_decile_score"},
                                                                    {"label":"name"},{"label":"c_charge_degree"}],
                                         'protected_currentValues':[{"label":"v_decile_score"},{"label":"violence_score"},{"label":"decile_score"}]}

    # gnl.app.config["CURRENT_DF"].drop(columns=gnl.app.config["CURRENT_IGNORED_COLUMNS"], inplace=True)

    ##
    # gnl.app.config["CURRENT_DF"].to_csv(os.path.join(gnl.app.config["DATA_FOLDER"], "numeric.csv"), index=False)
    # gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"].to_csv(
    #     os.path.join(gnl.app.config["DATA_FOLDER"], "complete.csv"), index=False)
    ##
    # likes.get_correlation()
    # likes.get_coverage()
    # likes.get_multi_fd()
    # likes.get_multi_ar()
    return render_template("label.html",**context)



# @gnl.app.route('/manual/', methods=['GET', 'POST'])
# def manual():
#     print("\n**manual**\n")
#     context = {}
#
#     if request.method == "POST":
#         print("\n**manual post**\n")
#
#         # other information entered
#         gnl.app.config["CURRENT_MANUAL_INFO"]['url'] = flask.request.form['url'] if 'url' in flask.request.form else ""
#         gnl.app.config["CURRENT_MANUAL_INFO"]['date'] = flask.request.form[
#             'date'] if 'date' in flask.request.form else ""
#         gnl.app.config["CURRENT_MANUAL_INFO"]['license'] = flask.request.form[
#             'license'] if 'license' in flask.request.form else ""
#
#         if 'p_attrs' in flask.request.form:
#             p_attrs = [entry.strip().lower().replace(" ", "_").replace(",", "_") for entry in flask.request.form['p_attrs'].split(",") if entry.strip()]
#             df_dict = {el: 0 for el in list(gnl.app.config["CURRENT_DF"])}
#             print(df_dict.keys())
#             # entered protected attributes should be ignored in the analysis
#             valid_p_attrs = [el for el in p_attrs if el in df_dict]
#
#             print("valid_p_attrs is ", valid_p_attrs)
#
#             # if the entered any valid protected attributes, then saved as ignored columns
#             if valid_p_attrs:
#                 gnl.app.config["CURRENT_MANUAL_INFO"]['p_attrs'] = valid_p_attrs
#                 gnl.app.config["CURRENT_IGNORED_COLUMNS"] += valid_p_attrs
#                 print("after manual", gnl.app.config["CURRENT_IGNORED_COLUMNS"])
#                 return redirect(url_for('extra_info'))
#         return redirect(url_for('label'))
#
#     return render_template("manual.html", **context)
#
#
# @gnl.app.route('/warning/', methods=['GET', 'POST'])
# def warning():
#     print("\n**warning**\n")
#     return render_template("warning.html")
#
# @gnl.app.route('/extra_info/', methods=['GET', 'POST'])
# def extra_info():
#     print("\n**extra_info**\n")
#     if request.method == "POST":
#         print("\n**extra_info post**\n")
#
#         # the checked column should be ignored
#         gnl.app.config["CURRENT_IGNORED_COLUMNS"] += flask.request.form.getlist('checks')
#
#         return redirect(url_for('label'))
#
#     context = {"high_warnings": {}, "middle_warnings": {}}
#     threshold_middle = 0.8
#     threshold_high = 0.999  # because sometimes calc to 0.99999...
#
#     df = gnl.app.config["CURRENT_DF"]
#     dff = gnl.app.config["CURRENT_COLUMN_TYPES"]
#     colnames = list(df)
#     print("colnames are ", colnames)
#     print("year", df["year"].corr(df["fl_num"]))
#     for p_attr in gnl.app.config["CURRENT_MANUAL_INFO"]['p_attrs']:
#
#         # sensitivity analysis by checking correlation between p_attrs and other numerical columns to see
#         #   if others may also be protected
#         if dff[p_attr][0] != "str" and dff[p_attr][0] != "empty":
#             for i, colname in enumerate(colnames):
#                 if colname not in gnl.app.config["CURRENT_MANUAL_INFO"]['p_attrs'] and dff[colname][0] != "str" and dff[colname][0] != "empty":
#
#
#                     if df[p_attr].corr(df[colname]) >= threshold_high:
#                         if p_attr not in context["high_warnings"]:
#                             context["high_warnings"][p_attr] = []
#                         context["high_warnings"][p_attr].append(str(colname))
#
#                     elif df[p_attr].corr(df[colname]) > threshold_middle:
#                         if p_attr not in context["middle_warnings"]:
#                             context["middle_warnings"][p_attr] = []
#                         context["middle_warnings"][p_attr].append(str(colname))
#     print("result contxt", context)
#     # go to label page if nothing new discovered
#     if not context['high_warnings'] and not context['middle_warnings']:
#         return redirect(url_for('label'))
#     return render_template("extra_info.html", **context)


# @gnl.app.route('/loading/', methods=['GET', 'POST'])
# def loading():
#     context={}
#
#     print("\n\nloading\n\n")
#     temp_filename=request.args.get('temp_filename')
#     hash_filename=request.args.get('hash_filename')
#
#     # if "CURRENT_LOADED" in gnl.app.config and gnl.app.config["CURRENT_LOADED"]:
#     #     return render_template("label.html")
#     print("start moving")
#
#     shutil.move(temp_filename, hash_filename)
#     gnl.app.logger.debug("Saved %s", hash_filename)
#     gnl.app.config["CURRENT_FILE"] = hash_filename
#
#     print("start preprocessing")
#
#     gnl.app.config["CURRENT_LOADED"] = True
#     df = pd.read_csv(gnl.app.config["CURRENT_FILE"])
#
#     print("df", df)
#
#     helper.normalize_colnames(df)
#     helper.clean(df)
#     gnl.app.config["CURRENT_DF"] = df
#     gnl.app.config["CURRENT_COLUMN_TYPES"] = helper.find_types_of_table(df)
#
#     helper.fill_na(gnl.app.config['CURRENT_DF'])
#     dff = gnl.app.config["CURRENT_COLUMN_TYPES"]
#     gnl.app.config["CURRENT_IGNORED_COLUMNS"] += [col for col in list(gnl.app.config["CURRENT_DF"])
#                                                   if (dff[col][0] == "str" or dff[col][0] == "empty")]
#     gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"] = gnl.app.config["CURRENT_DF"].copy()
#     gnl.app.config["CURRENT_DF"].drop(columns=gnl.app.config["CURRENT_IGNORED_COLUMNS"], inplace=True)
#
#     return redirect(url_for('selection'))

# @gnl.app.route('/label/', methods=['GET', 'POST'])
# def label():
#     print("\n\n\n\n\n\n\n\n\n\n\n\n**label**\n")
#
#     df = gnl.app.config["CURRENT_DF"]
#
#     # standardize the column names
#     helper.normalize_colnames(df)
#     # clean the strings that are actually numbers and also invalid string such as those with comma and special chars
#     helper.clean(df)
#     gnl.app.config["CURRENT_DF"] = df
#     gnl.app.config["CURRENT_COLUMN_TYPES"] = helper.find_types_of_table(df)
#     helper.fill_na(gnl.app.config['CURRENT_DF'])
#     #### data for testing
#     # gnl.app.config["CURRENT_FILE"] = os.path.join(
#     #     gnl.app.config["UPLOAD_FOLDER"], 'testdata4.csv'
#     # )
#     # df = pd.read_csv(gnl.app.config["CURRENT_FILE"], index_col=False)
#     #
#     # df=gnl.app.config["CURRENT_DF"]
#     # for i in range(df.shape[0]-1):
#     #     df.at[i, "PRICE"]= "$"+str(randint(500, 100000))
#     #     df.at[i, "RAND FLOAT"]= float(np.random.normal(1110,200,1)[0])
#     # df.to_csv(gnl.app.config["CURRENT_FILE"])
#
#
#     # clean the strings that are actually numbers and also invalid string such as those with comma and special chars
#     # all int to float
#
#     # keep record, and find types of each column
#     # gnl.app.config["CURRENT_DF"]=df
#     dff=gnl.app.config["CURRENT_COLUMN_TYPES"]
#
#     # fill in NaN for string and float
#
#
#     # string empty p_attrs correlated p_attrs are in ignored list
#     # do strings for now
#     # todo
#
#     gnl.app.config["CURRENT_IGNORED_COLUMNS"] += [col for col in list(gnl.app.config["CURRENT_DF"])
#                                                   if (dff[col][0] == "empty")] # dff[col][0] == "str" or
#
#     # finalize df by dropping ignored columns. CURRENT_DF_WITH_IGNORED_COLUMNS is for fds and ars
#     gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]=gnl.app.config["CURRENT_DF"].copy()
#     print(gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"])
#
#     #normalize the name for fds and ars columns
#     helper.normalize_colnames(gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"])
#
#     # drop ignored columns
#     gnl.app.config["CURRENT_DF"]=gnl.app.config["CURRENT_DF"].drop(columns=gnl.app.config["CURRENT_IGNORED_COLUMNS"])
#
#     return render_template("label.html")


# @gnl.app.route('/accounts/login/', methods=['GET', 'POST'])
# def login():
#     """Login."""
#     if 'username' in session:
#         return redirect(url_for('index'))
#     if request.method == "POST":
#         data = gnl.model.get_db()
#
#         cur = data.execute('SELECT password FROM users'
#                            ' WHERE username = ?', [request.form['username']])
#         temp = cur.fetchall()
#
#         # judge existence and get hash of password in db
#         if not temp:
#             abort(403)
#         password_db = temp[0]['password']
#         salt = password_db.split('$')[1]
#         hash_db = password_db.split('$')[2]
#
#         # hash input password
#         password_input = request.form['password']
#         password_salted = salt + password_input
#         hash_obj = hashlib.new('sha512')
#         hash_obj.update(password_salted.encode('utf-8'))
#         hash_input = hash_obj.hexdigest()
#         if hash_db != hash_input:  # wrong password
#             abort(403)
#         session['username'] = request.form['username']
#         return redirect(url_for('index'))
#
#     return render_template("login.html")
#
#
# @gnl.app.route('/accounts/logout/')
# def logout():
#     """Logout."""
#     session.clear()
#     return redirect(url_for('login'))
#
#
# @gnl.app.route('/accounts/create/', methods=['GET', 'POST'])
# def create():
#     """Create."""
#     if 'username' in session:
#         return redirect(url_for('edit'))
#     if request.method == "POST":
#         data = gnl.model.get_db()
#
#         # Save POST request's file object to a temp file
#         dummy, temp_filename = tempfile.mkstemp()
#         file_name = flask.request.files["file"]
#         file_name.save(temp_filename)
#
#         # Compute filename
#         hash_txt = sha1sum(temp_filename)
#         dummy, suffix = os.path.splitext(file_name.filename)
#         hash_filename_basename = hash_txt + suffix
#         hash_filename = os.path.join(
#             gnl.app.config["UPLOAD_FOLDER"],
#             hash_filename_basename
#         )
#
#         # inputs
#         # input_fullname = request.form['fullname']
#         # input_username = request.form['username']
#         # input_email = request.form['email']
#
#         # hash input password
#         password_input = request.form['password']
#         algorithm = 'sha512'
#         salt = uuid.uuid4().hex
#         hash_obj = hashlib.new(algorithm)
#         password_salted = salt + password_input
#         hash_obj.update(password_salted.encode('utf-8'))
#         password_hash = hash_obj.hexdigest()
#         input_password = "$".join([algorithm, salt, password_hash])
#
#         data.execute('INSERT INTO users(username, fullname, email,'
#                      ' filename, password) VALUES(?,?,?,?,?)',
#                      [request.form['username'], request.form['fullname'],
#                       request.form['email'],
#                       hash_filename, input_password])
#
#         # Move temp file to permanent location
#         shutil.move(temp_filename, hash_filename)
#         gnl.app.logger.debug("Saved %s", hash_filename_basename)
#
#         session['username'] = request.form['username']
#         return redirect(url_for('index'))
#
#     return render_template("create.html")
#
#
# @gnl.app.route('/accounts/delete/', methods=['GET', 'POST'])
# def delete():
#     """delete."""
#     context = {'username': session['username']}
#
#     if request.method == "POST":
#         data = gnl.model.get_db()
#         # select all posts and delete
#         cur = data.execute('SELECT filename FROM'
#                            ' posts WHERE owner = ?',
#                            [session['username']])
#         temp = cur.fetchall()
#         for each in temp:
#             the_file = each['filename']
#             os.remove(os.path.join(gnl.app.config['UPLOAD_FOLDER'],
#                                    the_file))
#         # delete user's icon
#         cur = data.execute('SELECT filename FROM users'
#                            ' WHERE username = ?', [session['username']])
#         temp = cur.fetchall()
#         the_file = temp[0]['filename']
#         os.remove(os.path.join(gnl.app.config['UPLOAD_FOLDER'],
#                                the_file))
#
#         data.execute('DELETE FROM users WHERE username = ?',
#                      [session['username']])
#
#         session.clear()
#         return redirect(url_for('create'))
#     return render_template("delete.html", **context)
#
#
# @gnl.app.route('/uploads/<path:filename>')
# def download_file(filename):
#     """Download_file."""
#     return flask.send_from_directory(gnl.app.config['UPLOAD_FOLDER'],
#                                      filename)
#
#
# @gnl.app.route('/u/<user_url_slug>/', methods=['GET', 'POST'])
# def user_main_page(user_url_slug):
#     """User_main_page."""
#     if 'username' in session:
#         context = {'logname': session['username'], 'username': user_url_slug}
#         data = gnl.model.get_db()
#         if request.method == "POST":
#             if 'follow' in request.form:
#                 data.execute('INSERT INTO following '
#                              '(username1, username2) VALUES(?,?) ',
#                              [session['username'], user_url_slug])
#             elif 'unfollow' in request.form:
#                 data.execute('DELETE FROM following WHERE '
#                              'username1=? and username2=?',
#                              [session['username'], user_url_slug])
#             elif 'create_post' in request.form:
#                 # Save POST request's file object to a temp file
#                 dummy, temp_filename = tempfile.mkstemp()
#                 file_name = flask.request.files["file"]
#                 file_name.save(temp_filename)
#
#                 # Compute filename
#                 hash_txt = sha1sum(temp_filename)
#                 dummy, suffix = os.path.splitext(file_name.filename)
#                 hash_filename_basename = hash_txt + suffix
#                 hash_filename = os.path.join(
#                     gnl.app.config["UPLOAD_FOLDER"],
#                     hash_filename_basename
#                 )
#                 # in case no rows at all
#                 cur = data.execute('SELECT * FROM posts')
#                 temp = cur.fetchall()
#                 if not temp:
#                     max_postid = 1
#                 else:
#                     cur = data.execute('SELECT MAX(postid) '
#                                        'AS max_postid FROM posts')
#                     temp_max = cur.fetchall()
#                     max_postid = temp_max[0]['max_postid'] + 1
#
#                 data.execute('INSERT INTO posts (postid, filename, owner)'
#                              ' VALUES(?,?,?)',
#                              [max_postid, hash_filename_basename,
#                               session['username']])
#                 # Move temp file to permanent location
#                 shutil.move(temp_filename, hash_filename)
#                 gnl.app.logger.debug("Saved %s", hash_filename_basename)
#
#         # check following or not or the same as logged in user
#         cur = data.execute('SELECT * FROM following WHERE'
#                            ' username1 = ? AND  username2 = ?',
#                            [session['username'], user_url_slug])
#         context['logname_follows_username'] = bool(cur.fetchall())
#
#         # posts
#         cur = data.execute('SELECT postid, filename AS img_url FROM'
#                            ' posts WHERE owner= ? ORDER BY created DESC',
#                            [user_url_slug])
#         posts = cur.fetchall()
#
#         context['total_posts'] = len(posts)
#         context['posts'] = posts
#
#         # followers
#         cur = data.execute('SELECT * FROM following WHERE'
#                            ' username2= ? ', [user_url_slug])
#         context['followers'] = len(cur.fetchall())
#
#         # following
#         cur = data.execute('SELECT * FROM following WHERE'
#                            ' username1=?', [user_url_slug])
#         context['following'] = len(cur.fetchall())
#
#         # fullname
#         cur = data.execute('SELECT fullname FROM users WHERE'
#                            ' username= ?', [user_url_slug])
#         temp = cur.fetchall()
#         # in case no such user
#         if temp:
#             context['fullname'] = temp[0]['fullname']
#         else:
#             context['fullname'] = ""
#
#         return render_template("user.html", **context)
#     return redirect(url_for('login'))
#
#
# @gnl.app.route('/u/<user_url_slug>/followers/', methods=['GET', 'POST'])
# def user_followers(user_url_slug):
#     """User_followers."""
#     if 'username' in session:
#         context = {'logname': session['username']}
#         data = gnl.model.get_db()
#         if request.method == "POST":
#             if 'follow' in request.form:
#                 data.execute('INSERT INTO following'
#                              ' (username1, username2) VALUES(?,?) ',
#                              [session['username'], request.form['username']])
#             elif 'unfollow' in request.form:
#                 data.execute('DELETE FROM following'
#                              ' WHERE username1=? AND username2=?',
#                              [session['username'], request.form['username']])
#
#         cur = data.execute(
#             'SELECT DISTINCT username, filename as user_img_url'
#             ' FROM (SELECT username1 FROM '
#             'following WHERE username2 = ?) f INNER JOIN users ON f'
#             '.username1 = username', [user_url_slug])
#         followers = cur.fetchall()
#
#         for follower in followers:
#             cur = data.execute('SELECT * FROM following '
#                                'WHERE username1=? AND username2=?',
#                                [session['username'], follower['username']])
#             temp = cur.fetchall()
#             follower['logname_follows_username'] = bool(temp)
#
#         context['followers'] = followers
#
#         return render_template("followers.html", **context)
#     return redirect(url_for('login'))
#
#
# @gnl.app.route('/u/<user_url_slug>/following/', methods=['GET', 'POST'])
# def user_following(user_url_slug):
#     """User_following."""
#     if 'username' in session:
#         context = {'logname': session['username']}
#         data = gnl.model.get_db()
#         if request.method == "POST":
#             if 'follow' in request.form:
#                 data.execute('INSERT INTO following'
#                              ' (username1, username2) VALUES(?,?) ',
#                              [session['username'], request.form['username']])
#             elif 'unfollow' in request.form:
#                 data.execute('DELETE FROM following WHERE'
#                              ' username1=? and username2=?',
#                              [session['username'], request.form['username']])
#
#         cur = data.execute(
#             'SELECT DISTINCT username, filename as user_img_url'
#             ' FROM (SELECT username2 FROM '
#             'following WHERE username1 = ?) f INNER JOIN users ON f'
#             '.username2 = username', [user_url_slug])
#         following = cur.fetchall()
#
#         for follow in following:
#             cur = data.execute('SELECT * FROM following WHERE'
#                                ' username1=? AND username2=?',
#                                [session['username'], follow['username']])
#             follow['logname_follows_username'] = bool(cur.fetchall())
#
#         context['following'] = following
#         return render_template("following.html", **context)
#     return redirect(url_for('login'))
#
#
# @gnl.app.route('/p/<postid_slug>/', methods=['GET', 'POST'])
# def user_posts(postid_slug):
#     """Post."""
#     if 'username' in session:
#         data = gnl.model.get_db()
#         context = {}
#
#         if request.method == "POST":
#             if 'like' in request.form:
#                 data.execute('INSERT INTO likes (owner, postid) VALUES(?,?) ',
#                              [session['username'], request.form['postid']])
#             elif 'unlike' in request.form:
#                 data.execute('DELETE FROM likes WHERE owner = ? and postid=? ',
#                              [session['username'], request.form['postid']])
#             elif 'comment' in request.form:
#                 # in case no rows at all
#                 cur = data.execute('SELECT * FROM comments')
#                 temp = cur.fetchall()
#                 if not temp:
#                     max_id = 1
#                 else:
#                     cur = data.execute('SELECT MAX(commentid) AS'
#                                        ' max_id FROM comments')
#                     temp_max = cur.fetchall()
#                     max_id = temp_max[0]['max_id'] + 1
#
#                 data.execute('INSERT INTO comments '
#                              '(commentid, owner, postid, text) '
#                              'VALUES (?,?,?,?)',
#                              [max_id, session['username'],
#                               request.form['postid'], request.form['text']])
#             elif 'uncomment' in request.form:
#                 data.execute('DELETE FROM comments WHERE'
#                              ' commentid = ?', [request.form['commentid']])
#             elif 'delete' in request.form:
#                 cur = data.execute('SELECT filename FROM'
#                                    ' posts WHERE postid = ?',
#                                    [request.form['postid']])
#                 temp = cur.fetchall()
#                 the_file = temp[0]['filename']
#                 os.remove(os.path.join(gnl.app.config['UPLOAD_FOLDER'],
#                                        the_file))
#                 data.execute('DELETE FROM posts WHERE postid = ?',
#                              [request.form['postid']])
#                 return redirect(url_for('index'))
#
#         cur = data.execute('SELECT postid,owner,filename as img_url,'
#                            'created AS timestamp FROM posts'
#                            ' WHERE postid=?', [postid_slug])
#
#         # in case no such post
#         temp = cur.fetchall()
#         if temp:
#             context = temp[0]
#         else:
#             abort(404)
#             # debug
#         context['logname'] = session['username']
#
#         # posts have postid, owner, owner_img_url, filename, created,
#         #   likes, like, comments
#
#         # owner img
#         cur = data.execute(
#             'SELECT filename AS owner_img_url FROM users'
#             ' WHERE username = ?', [context['owner']])
#         temp = cur.fetchall()
#         context['owner_img_url'] = temp[0]['owner_img_url']
#
#         # like or not
#         cur = data.execute('SELECT * FROM likes WHERE owner = ? '
#                            'AND postid = ?',
#                            [session['username'], context['postid']])
#         temp = cur.fetchall()
#         context['like'] = bool(temp)
#
#         # likes
#         cur = data.execute('SELECT COUNT(*) AS cnt FROM likes'
#                            ' WHERE postid = ?', [context['postid']])
#         temp = cur.fetchall()
#         context['likes'] = temp[0]['cnt']
#
#         # comments
#         cur = data.execute(
#             'SELECT owner, text, commentid FROM comments '
#             'WHERE postid = ? ORDER BY created', [context['postid']])
#         temp = cur.fetchall()
#         context['comments'] = temp
#
#         # humanize time
#         temp = arrow.get(context['timestamp'])
#         context['timestamp'] = temp.humanize()
#
#         return render_template("post.html", **context)
#     return redirect(url_for('login'))
#
#
# @gnl.app.route('/explore/', methods=['GET', 'POST'])
# def explore():
#     """Explore."""
#     if 'username' in session:
#         data = gnl.model.get_db()
#         context = {'logname': session['username']}
#         if request.method == "POST":
#             if 'follow' in request.form:
#                 data.execute('INSERT INTO following '
#                              '(username1, username2) VALUES(?,?) ',
#                              [session['username'], request.form['username']])
#
#         # get users that the loggedin follows
#         cur = data.execute('SELECT username2 FROM following '
#                            'WHERE username1=?', [session['username']])
#         temp = cur.fetchall()
#
#         right_dict = {}
#         not_following = []
#
#         # record users that the loggedin follows in a dict
#         for i in temp:
#             right_dict[i['username2']] = True
#
#         # get all users and select the users that loggedin doesn't follow
#         cur = data.execute('SELECT username, filename '
#                            'AS user_img_url FROM users')
#         temp = cur.fetchall()
#         for i in temp:
#             if not i['username'] in right_dict:
#                 not_following.append(i)
#         context['not_following'] = not_following
#         return render_template("explore.html", **context)
#     return redirect(url_for('login'))
#
#
# @gnl.app.route('/accounts/edit/', methods=['GET', 'POST'])
# def edit():
#     """Edit."""
#     if 'username' in session:
#         data = gnl.model.get_db()
#         context = {'logname': session['username']}
#         cur = data.execute('SELECT fullname, email, filename FROM users'
#                            ' WHERE username = ?', [context['logname']])
#         temp = cur.fetchall()
#         # fill with most recent
#         context['fullname'] = temp[0]['fullname']
#         context['email'] = temp[0]['email']
#         if request.method == "POST":
#             # Save POST request's file object to a temp file
#             dummy, temp_filename = tempfile.mkstemp()
#             file_name = flask.request.files["file"]
#             file_name.save(temp_filename)
#
#             # if uploaded file
#             if file_name:
#                 # Compute filename
#                 hash_txt = sha1sum(temp_filename)
#                 dummy, suffix = os.path.splitext(file_name.filename)
#                 hash_filename_basename = hash_txt + suffix
#                 hash_filename = os.path.join(
#                     gnl.app.config["UPLOAD_FOLDER"],
#                     hash_filename_basename
#                 )
#                 data.execute('UPDATE users SET filename = ?'
#                              'WHERE username = ?',
#                              [hash_filename_basename, context['logname']])
#
#                 # delete old file???
#                 the_file = temp[0]['filename']
#                 os.remove(os.path.join(gnl.app.config['UPLOAD_FOLDER'],
#                                        the_file))
#                 # Move temp file to permanent location
#                 shutil.move(temp_filename, hash_filename)
#                 gnl.app.logger.debug("Saved %s", hash_filename_basename)
#
#             # update full name and email
#             full = request.form['fullname']
#             mail = request.form['email']
#             log = session['username']
#             data.execute('UPDATE users SET fullname = ?, email = ?'
#                          'WHERE username = ?',
#                          [full, mail, log])
#
#         return render_template("edit.html", **context)
#     return redirect(url_for('login'))
#
#
# @gnl.app.route('/accounts/password/', methods=['GET', 'POST'])
# def password():
#     """Password."""
#     if 'username' in session:
#         data = gnl.model.get_db()
#
#         context = {'logname': session['username']}
#
#         if request.method == "POST":
#
#             cur = data.execute('SELECT password FROM users'
#                                ' WHERE username = ?', [session['username']])
#             temp = cur.fetchall()
#             # judge existence and get hash of password in db
#             if not temp:
#                 abort(403)
#             password_db = temp[0]['password']
#             salt = password_db.split('$')[1]
#             hash_db = password_db.split('$')[2]
#
#             # hash input password
#             password_input = request.form['password']
#             password_salted = salt + password_input
#             hash_obj = hashlib.new('sha512')
#             hash_obj.update(password_salted.encode('utf-8'))
#             hash_input = hash_obj.hexdigest()
#
#             # wrong password
#             if hash_db != hash_input:
#                 abort(403)
#             if request.form['new_password1'] != request.form['new_password2']:
#                 abort(401)
#
#             # store the new password
#             # hash input password into db_string
#
#             new_password_input = request.form['new_password1']
#             algorithm = 'sha512'
#             salt = uuid.uuid4().hex
#             hash_obj = hashlib.new(algorithm)
#             password_salted = salt + new_password_input
#             hash_obj.update(password_salted.encode('utf-8'))
#             password_hash = hash_obj.hexdigest()
#             new_hashed_password = "$".join([algorithm, salt, password_hash])
#             # store into db
#             data.execute('UPDATE users SET password = ?'
#                          ' WHERE username = ?',
#                          [new_hashed_password, session['username']])
#
#             return redirect(url_for('edit'))
#         return render_template("password.html", **context)
#
#     return redirect(url_for('login'))
"""REST API for likes."""
import flask
import gnl
from flask import make_response
from flask import jsonify
from flask import request
import numpy as np
from gnl.views import apriori
from gnl.views.fd.utils import reader
from gnl.views.fd.utils import writer
from gnl.views.fd.algorithm import tane
from gnl.views import helper
from statistics import mean, median
import pandas as pd
import os
import json
import pprint
import pandas as pd
from jpype import *
from copy import deepcopy
import random
"""you might end up refactoring parts of this code later 
to avoid copy-pasted code shared between the REST API and 
server-side template views."""


# @gnl.app.route('/api/file/', methods=['GET', 'POST'])
# def get_file():
#     print("access test")
#     # context = {"original":"RecidivismData_Original.csv", "mups":"mups.json", "output":"result.json"}
#     context = {"cols":list(range(len(list(gnl.app.config["CURRENT_DF"]))))}
#
#     # , "output": gnl.app.config["OUTPUT"],
#     # "cols": list(range(len(list(pd.read_csv(os.path.join(
#     #     gnl.app.config["DATA_FOLDER"],
#     #     "RecidivismData_Original.csv"
#     # ), index_col=False)))))
#     return jsonify(**context)

@gnl.app.route('/api/form_submit/', methods=['GET', 'POST'])
def form_submit():
    # here do stuff and save json

    context = {}
    if not request.json:
        flask.abort(400)
    gnl.app.config["CURRENT_SELECTION"] = request.json
    sel = gnl.app.config["CURRENT_SELECTION"]

    print("sel\n")
    pprint.pprint(sel)

    # protected and non-protected attributes
    col_names = list(gnl.app.config["CURRENT_DF"])
    # print("col_names", col_names)
    attribute_currentValues = [i['label'] for i in sel['attribute_currentValues']
                               if gnl.app.config["CURRENT_COLUMN_TYPES"][i['label']][0] not in ["str", "empty"]] \
        if not sel['is_whole'] else col_names

    if sel['is_single_column']: sel['protected_currentValues']=[sel['protected_currentValues']] if sel['protected_currentValues'] else []
    protected_currentValues = [i['label'] for i in sel['protected_currentValues']
                                   if gnl.app.config["CURRENT_COLUMN_TYPES"][i['label']][0] not in ["str", "empty"]]
    # print("sel['protected_currentValues']", sel['protected_currentValues'])
    # print("protected_currentValues", protected_currentValues)
    all_values = list(set(attribute_currentValues + protected_currentValues))
    gnl.app.config["CURRENT_DF"] = gnl.app.config["CURRENT_DF"][all_values]

    # range query
    # query_cols = sel["query_currentValues"]

    # select range
    if sel["is_query"]:
        query_ranges = sel["query_rangeValues"]
        for key in query_ranges:

            # check the key has an existing range
            if query_ranges[key]:
                if gnl.app.config["CURRENT_COLUMN_TYPES"][key][0] != "str":
                    gnl.app.config["CURRENT_DF"] = \
                        gnl.app.config["CURRENT_DF"][
                            gnl.app.config["CURRENT_DF"][key] \
                                .between(float(query_ranges[key][0]), float(query_ranges[key][1]), inclusive=True)]
                else:
                    gnl.app.config["CURRENT_DF"] = \
                        gnl.app.config["CURRENT_DF"][
                            gnl.app.config["CURRENT_DF"][key]==query_ranges[key]]

    # slicing completed, count missing before fill in nan
    if not sel["is_single_column"]:
        for col_name in list(gnl.app.config["CURRENT_DF"]):
            for entry in gnl.app.config["CURRENT_DF"][col_name]:
                if helper.is_nan(entry):
                    gnl.app.config['NUM_MISSING'] += 1

    gnl.app.config['CURRENT_DF'] = helper.fill_na(gnl.app.config['CURRENT_DF'])
    dff = gnl.app.config["CURRENT_COLUMN_TYPES"]
    gnl.app.config["CURRENT_IGNORED_COLUMNS"]=[]
    gnl.app.config["CURRENT_IGNORED_COLUMNS"] += [col for col in list(gnl.app.config["CURRENT_DF"])
                                                      if (dff[col][0] == "str" or dff[col][0] == "empty")]

    # print("gnl.app.config[CURRENT_IGNORED_COLUMNS]", gnl.app.config["CURRENT_IGNORED_COLUMNS"])
    # keep full dataset
    gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"] = gnl.app.config["CURRENT_DF"].copy()
    # print("cur df", gnl.app.config["CURRENT_DF"])
    gnl.app.config["CURRENT_DF"].drop(columns=gnl.app.config["CURRENT_IGNORED_COLUMNS"], inplace=True)

    # print("cur df:\n")
    # pprint.pprint(gnl.app.config["CURRENT_DF"])
    #
    # for col in gnl.app.config["CURRENT_DF"]:
    #     pprint.pprint(gnl.app.config["CURRENT_DF"][col])

    # numeric single column
    if sel["is_single_column"] and sel['protected_currentValues'] and dff[sel['protected_currentValues'][0]['label']][0] not in ["str", "empty"]:
        print("in num single")
        print("gg", sel['protected_currentValues'][0]['label'])
        gnl.app.config["CURRENT_DF"][[sel['protected_currentValues'][0]['label']]].to_csv(os.path.join(gnl.app.config["DATA_FOLDER"], "numeric_single.csv"), index=False)
        # gnl.app.config["CURRENT_DF"][sel['protected_currentValues'][0]['label']].to_csv(os.path.join(gnl.app.config["DATA_FOLDER"], "toy.csv"))

    # numeric.csv and complete.csv
    gnl.app.config["CURRENT_DF"].to_csv(os.path.join(gnl.app.config["DATA_FOLDER"], "numeric.csv"), index=False)
    gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"].to_csv(
        os.path.join(gnl.app.config["DATA_FOLDER"], "complete.csv"), index=False)

    # print("\n\n\n\ncur df colnames",list(gnl.app.config["CURRENT_DF"]), "\n\n\n\n")
    # print(list(gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]))

    widget_currentValues = [i['label'] for i in sel['widget_currentValues']]
    # if((not widget_currentValues) or "Functional Dependencies" in widget_currentValues):
    #     get_multi_fd()
        # tmp_dict = {'colnames': list(gnl.app.config["CURRENT_COLUMN_TYPES"])}
        # gnl.app.config["JSON_OUT"].update(tmp_dict)
        # pprint.pprint(gnl.app.config["JSON_OUT"])
        # with open(os.path.join(gnl.app.config["DATA_FOLDER"], "result.json"), 'w') as outfile:
        #     json.dump(gnl.app.config["JSON_OUT"], outfile)

    # if ((not sel["is_single_column"]) and ((not widget_currentValues) or "Maximal Uncovered Patterns" in widget_currentValues)):
    #     print("yes")
        # with open(os.path.join(gnl.app.config["DATA_FOLDER"], "mups.json"), 'w') as outfile:
        #     json.dump({"node":"mups", "children":[]}, outfile)
        # get_coverage()
    return jsonify(**context)

@gnl.app.route('/api/get_colnames/', methods=['GET'])
def get_colnames():
    print("\n***accessed get colnames\n")
    context = {'colnames': list(gnl.app.config["CURRENT_COLUMN_TYPES"])}
    # 'colnames': list(set(list(cur_df)) - set(gnl.app.config["CURRENT_IGNORED_COLUMNS"]))
    # print("context are", context)
    # todo
    context['str_colnames']=[col for col in list(gnl.app.config["CURRENT_DF"])
                            if gnl.app.config["CURRENT_COLUMN_TYPES"][col][0] == "str"]
    # print(context)
    # gnl.app.config["JSON_OUT"].update(context)
    # with open(os.path.join(gnl.app.config["DATA_FOLDER"], "output.json"), 'w') as outfile:
    #     json.dump(gnl.app.config["JSON_OUT"], outfile)
    return jsonify(**context)


@gnl.app.route('/api/coverage/', methods=['GET'])
def get_coverage():
    print("\n**get coverage**\n")

    # get classes
    cpopt = "-Djava.class.path=%s" % (gnl.app.config["COVERAGE_FOLDER"] + "/target/classes")
    if not isJVMStarted():
        startJVM(getDefaultJVMPath(), "-ea", cpopt)
    # print("classpath:", cpopt)

    dataset = JClass('io.DataSet')
    hybrid = JClass('search.HybridSearch')

    # read entire dataset
    df = gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]
    dff = gnl.app.config["CURRENT_COLUMN_TYPES"]

    # now only for str cols
    # todo
    df=df.drop(columns=[col for col in list(df) if dff[col][0] == "empty"])

    valid_cols, valid_col_indices, cardinality, categories=[], [], [], []
    for i, col in enumerate(list(df)):

        # restrict cardinality
        temp_set=set(list(df[col]))

        if len(temp_set)<=9 and len(temp_set)>=2:
            valid_cols.append(col)
            valid_col_indices.append(i)
            cardinality.append(len(temp_set))

            # encoding valid categorical columns
            labels, uniques = pd.factorize(list(df[col]), sort=True)
            df[col]=labels
            categories.append([col+":"+str(unique) for unique in uniques])

    df = df[valid_cols].astype(str)
    df.to_csv(gnl.app.config["CURRENT_TEMP_FILE"], index=False)

    dataset1 = dataset(gnl.app.config["CURRENT_TEMP_FILE"], cardinality, [i for i in range(len(valid_cols))], df.shape[0])

    hybrid1 = hybrid(dataset1)
    a = hybrid1.findMaxUncoveredPatternSet(500, 3)

    mups = [i.getStr() for i in a]

    ###
    # shutdownJVM()
    ###

    uncovered_patterns = []
    val_cnt = {}
    pattern_lists=[]
    for i, mup in enumerate(mups):
        # print("mup:",mup)
        tmp_list=[]
        for j, char in enumerate(mup):
            if char != 'x':
                tmp_list.append(categories[j][ord(char)-ord('0')])
                if categories[j][ord(char)-ord('0')] not in val_cnt:
                    val_cnt[categories[j][ord(char) - ord('0')]] = 0
                    val_cnt[categories[j][ord(char)-ord('0')]]+=1
        pattern_lists.append(tmp_list)
        uncovered_patterns.append(" ".join(tmp_list))
        # uncovered_patterns.append(" ".join([categories[j][ord(char)-ord('0')] for j, char in enumerate(mup) if char!='x']))

    # generate tree
    sprop={"width": 20,
            "height": 20,
            "x": -10,
            "y": -10,
            "fill": 'red'}
    tree=[{"name":"mups", "children":[]}]
    ptrs=[tree[0]]*len(pattern_lists)
    for i in range(len(ptrs)):
        ptrs[i]=tree[0]
    pos, cur = 0, tree[0]
    while True:
        found_at_least_one = False

        # each pattern
        for i, pattern_list in enumerate(pattern_lists):

            # sort the pattern values according to count, to minimize horizontal distance
            pattern_lists[i]=sorted(pattern_list, key=lambda x: -val_cnt.get(x))

            # if current position is still not passing the end
            if pos<len(pattern_list):
                found_at_least_one=True
                exist_node=False

                # check whether the current is already a child from the last ptr
                for j, child in enumerate(ptrs[i]["children"]):
                    if child["name"]==pattern_list[pos]:
                        exist_node=True
                        ptrs[i]=ptrs[i]["children"][j]
                        break
                if not exist_node:
                    sprop["fill"]=random.choice(["red", "blue", "green", "yellow", "purple"])
                    ptrs[i]["children"].append({"name":pattern_list[pos], "children":[]})
                    ptrs[i]=ptrs[i]["children"][-1]
        pos+=1

        # if pos passed the end of all pattern lists, then stop
        if not found_at_least_one:
            break

    # to mup.json
    context={"tree":tree[0]}
    # context = {'mups': uncovered_patterns, tree: tree}
    print("uncovered_patterns:",uncovered_patterns)
    # print("tree", tree)
    # gnl.app.config["JSON_OUT"].update(context)
    # with open(os.path.join(gnl.app.config["DATA_FOLDER"], "result.json"), 'w') as outfile:
    #     json.dump(gnl.app.config["JSON_OUT"], outfile)
    # with open(os.path.join(gnl.app.config["DATA_FOLDER"], "mups.json"), 'w') as outfile:
    #     json.dump(tree, outfile)
    # with open(os.path.join(gnl.app.config["DATA_FOLDER"], "mups.json")) as infile:
    #     data = json.load(infile)
    #     print("data is ", data)
    # print("data complete")

    return jsonify(**context)

# @gnl.app.route('/api/single_column/', methods=['GET', 'POST'])
# def get_single_column():
#     sel = gnl.app.config["CURRENT_SELECTION"]
#     colname = sel["attribute_currentValues"]['label']
#
#     cur_df = gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]
#     context = {}
#
#     # get rid of missing entries
#     col_type = gnl.app.config["CURRENT_COLUMN_TYPES"][colname][0]
#
#     # get rid of nan
#     clean_column = [entry for entry in cur_df[colname] if not helper.is_nan(entry)]
#     context['isnumeric'] = col_type != "str" and col_type != "empty"
#     context['number_of_nulls'] = len(cur_df[colname]) - len(clean_column)
#
#     # number of distinct value divided by num rows
#     context['uniqueness'] = float(len(set(clean_column))) / float(len(cur_df[colname])) if float(
#         len(cur_df[colname])) else 0
#     if col_type != "str":
#         context['Q1'] = np.percentile(clean_column, 25)
#         context['Median'] = np.percentile(clean_column, 50)
#         context['Q3'] = np.percentile(clean_column, 75)
#         context['isnumeric'] = True
#         context['max'] = max(clean_column)
#         context['min'] = min(clean_column)
#         context['mean'] = mean(clean_column)
#
#     # todo: need edit, it is like date, alphabetical, alphanumeric, etc.
#     context['basic_type'] = col_type
#     context['column'] = clean_column
#     return jsonify(**context)


@gnl.app.route('/api/multi_basic/', methods=['GET', 'POST'])
def get_multi_basic():
    print("\n***get_multi_basic\n")
    context = {}
    #todo

    # df = gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]
    df = gnl.app.config["CURRENT_DF"]
    context['keywords'] = helper.get_keywords(df)
    context['num_rows'] = df.shape[0]
    context['num_cols'] = df.shape[1]
    context['num_missing'] = gnl.app.config['NUM_MISSING']


    # gnl.app.config["JSON_OUT"].update(context)
    # with open(os.path.join(gnl.app.config["DATA_FOLDER"], "result.json"), 'w') as outfile:
    #     json.dump(gnl.app.config["JSON_OUT"], outfile)
    return jsonify(**context)


@gnl.app.route('/api/multi_fd/', methods=['GET', 'POST'])
def get_multi_fd():
    print("\n***get_multi_fd\n")
    context = {}
    df = gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]
    col_names = list(df)

    sel = gnl.app.config["CURRENT_SELECTION"]
    pattrs = [i['label'] for i in sel["protected_currentValues"]]
    cols = [i['label'] for i in sel['attribute_currentValues']] if not sel['is_whole'] else col_names

    for pattr in pattrs:
        if pattr not in cols:
            cols.append(pattr)

    # print("pattr", pattrs)
    # drop the spaces and commas
    df.to_csv(gnl.app.config["CURRENT_TEMP_FILE"], index=False)

    # start discovering
    table = reader.Reader.read_table_from_file(gnl.app.config["CURRENT_TEMP_FILE"], ",")
    tne = tane.TANE(table)
    tne.run()
    wt = writer.Writer(col_names)
    output = wt.write_dependency_to_file(tne.ans)
    releveant_output = [comb for comb in output if any([item in pattrs for item in comb.split("=>")[1].split(",")])]
    if output and output[0]=="Timelimit=>Exceeded(because of too many columns)":
        releveant_output=output


    node_set, link_set, nodes, links = set(), set(), [], []
    for fd in releveant_output:
        l, r = fd.split("=>")
        # l_list,r_list=l.split(","),r.split(",")
        node_set.add(l)
        node_set.add(r)
        link_set.add((l, r))
    for node in node_set:
        nodes.append({"id": node})
    for link in link_set:
        links.append({"source": link[0], "target": link[1]})
    if not nodes: nodes.append({"id": "NONE EXISTS"})
    context["nodes"] = nodes
    context["links"] = links
    print("fd context")
    print(context)
    return jsonify(**context)


@gnl.app.route('/api/multi_ar/', methods=['GET', 'POST'])
def get_multi_ar():
    print("\n***get_multi_ar\n")

    context = {}
    df = gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"].copy()
    col_names = list(df)

    # sel = gnl.app.config["CURRENT_SELECTION"]
    # cols = [i['label'] for i in sel['attribute_currentValues']] if not sel['is_whole'] else col_names

    ### modify so that each entry has it corresponding column name indicator
    df=df[col_names].astype(str)
    # print("prev df", df)
    for j, colname in enumerate(list(df)):
        df[colname]=colname+":"+df[colname].astype(str)

    # drop the spaces and commas
    df.to_csv(gnl.app.config["CURRENT_TEMP_FILE"], index=False)

    # start apriori
    a = apriori.Apriori(gnl.app.config["CURRENT_TEMP_FILE"], 0.25, -1)
    a.run()

    node_set, link_set, nodes, links=set(),set(), [], []
    for ar in a.true_associations:
        l,r=ar.split("=>")
        # l_list,r_list=l.split(","),r.split(",")
        node_set.add(l)
        node_set.add(r)
        link_set.add((l, r))
        # for i, l_item in enumerate(l_list):
        #     for j, r_item in enumerate(r_list):
        #         node_set.add(l_item)
        #         node_set.add(r_item)
        #         link_set.add((l_item, r_item))
    for node in node_set:
        nodes.append({"id":node})
    for link in link_set:
        links.append({ "source": link[0], "target": link[1] })

    if not nodes: nodes.append({"id": "NO ASSOCIATION RULE EXISTS"})
    context["nodes"]=nodes
    context["links"]=links
    print("ar context")
    print(context)
    # gnl.app.config["JSON_OUT"].update(context)
    # with open(os.path.join(gnl.app.config["DATA_FOLDER"], "result.json"), 'w') as outfile:
    #     json.dump(gnl.app.config["JSON_OUT"], outfile)

    return jsonify(**context)


# @gnl.app.route('/api/correlation/', methods=['GET', 'POST'])
# def get_correlation():
#     print("\n***get_correlation***\n")
#
#     context = {}
#
#     # current df ignores empty and string
#     df = gnl.app.config["CURRENT_DF"]
#     dff = gnl.app.config["CURRENT_COLUMN_TYPES"]
#     col_names = list(df)
#     sel = gnl.app.config["CURRENT_SELECTION"]
#     attribute_currentValues = [i['label'] for i in sel['attribute_currentValues'] if
#                                dff[i['label']][0] not in ["str", "empty"]] \
#         if not sel['is_whole'] else col_names
#     protected_currentValues = [i['label'] for i in sel['protected_currentValues'] if
#                                dff[i['label']][0] not in ["str", "empty"]]
#
#     # print("attribute_currentValues ",attribute_currentValues )
#     # print("protected_currentValues ",protected_currentValues )
#     # print("list(set(attribute_currentValues)-set(protected_currentValues))", list(set(attribute_currentValues)-set(protected_currentValues)))
#     other_attribute_currentValues=list(set(attribute_currentValues) - set(protected_currentValues))
#     context["correlations"] = helper.get_corr_ranking(df,
#                                                       other_attribute_currentValues,
#                                                       protected_currentValues)
#
#     context["xlabs"]=other_attribute_currentValues
#     context["ylabs"]=protected_currentValues
#     print("labs", context["xlabs"])
#
#     gnl.app.config["JSON_OUT"].update(context)
#     with open(os.path.join(gnl.app.config["DATA_FOLDER"], "result.json"), 'w') as outfile:
#         json.dump(gnl.app.config["JSON_OUT"], outfile)
#     return jsonify(**context)

# @gnl.app.route('/api/numeric_colnames/', methods=['GET'])
# def get_numeric_colnames():
#     print("\n***accessed get colnames\n")
#
#     cur_df = gnl.app.config["CURRENT_DF"]
#
#     # 'colnames': list(set(list(cur_df)) - set(gnl.app.config["CURRENT_IGNORED_COLUMNS"]))
#
#     return jsonify(**context)

# df=pd.read_csv("D:\\Documents\\CoverageJava\\data\\airbnb_100000C.csv")
# for col in df:
#     #get dtype for column
#     dt = df[col].dtype
#     #check if it is a number
#     if dt == int or dt == float:
#         df[col].fillna(0)
#     else:
#         df[col].fillna("NULL")
# df.to_csv("D:\\Documents\\CoverageJava\\data\\airbnb_100000C.csv")


# @gnl.app.route('/api/single_basic/<colname>/', methods=['GET', 'POST'])
# def get_single_basic(colname):
#
#     print("\n***get_single_basic\n")
#
#     cur_df = gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]
#     context = {}
#
#     # get rid of missing entries
#     col_type = gnl.app.config["CURRENT_COLUMN_TYPES"][colname][0]
#
#     # get rid of nan
#     clean_column = [entry for entry in cur_df[colname] if not helper.is_nan(entry)]
#     context['isnumeric'] = False
#     context['number_of_nulls'] = len(cur_df[colname]) - len(clean_column)
#
#     # number of distinct value divided by num rows
#     context['uniqueness'] = float(len(set(clean_column))) / float(len(cur_df[colname]))
#
#     if col_type != "str":
#         context['isnumeric'] = True
#         context['max'] = max(clean_column)
#         context['min'] = min(clean_column)
#         context['mean'] = mean(clean_column)
#     # todo: need edit, it is like date, alphabetical, alphanumeric, etc.
#     context['basic_type'] = col_type
#
#     return jsonify(**context)


# @gnl.app.route('/api/single_graph/<colname>/', methods=['GET', 'POST'])
# def get_single_graph(colname):
#     print("\n***get_single_graph\n")
#
#     context = {}
#     cur_df = gnl.app.config["CURRENT_DF_WITH_IGNORED_COLUMNS"]
#     col_type = gnl.app.config["CURRENT_COLUMN_TYPES"][colname][0]
#     context['isnumeric'] = col_type != "str" and col_type != "empty"
#
#     # get rid of missing entries
#     clean_column = [entry for entry in cur_df[colname] if not helper.is_nan(entry)]
#     context['column'] = clean_column
#     # if context['isnumeric']:
#     #     context['column'] = clean_column
#     # else:
#     #     #pattern histgram
#     #     temp_dict={}
#     #     for k in clean_column:
#     #         if str(k) not in temp_dict:
#     #             temp_dict[str(k)]=1;
#     #         else: temp_dict[str(k)]+=1
#     #     context['columnx']=[k for k in sorted(temp_dict, key=lambda k: temp_dict[k], reverse=True)]
#     #     context['columny'] = [temp_dict[k] for k in context['columnx']]
#
#     # todo histo with same vals will give error
#     if context['isnumeric']:
#         context['Q1'] = np.percentile(clean_column, 25)
#         context['Median'] = np.percentile(clean_column, 50)
#         context['Q3'] = np.percentile(clean_column, 75)
#         context['max'] = max(clean_column)
#         context['min'] = min(clean_column)
#     print(clean_column)
#     return jsonify(**context)

# @gnl.app.route('/api/scatterplot/<colname0>/<colname1>/', methods=['GET', 'POST'])
# def get_scatterplot(colname0, colname1):
#
#     context = {"column0":[],"column1":[]}
#     print("\n***get_scatterplot\n")
#     print(colname0, "   ",colname1)
#     print("CURRENT_DF",gnl.app.config["CURRENT_DF"])
#     # what if either has missing entries
#
#     a, b = gnl.app.config["CURRENT_DF"][colname0], gnl.app.config["CURRENT_DF"][colname1]
#
#     print("\nstart scatter\n")
#     for i in range(min(len(list(a)), len(list(b)))):
#         if not helper.is_nan(a[i]) and not helper.is_nan(b[i]):
#             context["column0"].append(a[i])
#             context["column1"].append(b[i])
#
#     print(context["column0"], " \n ",context["column1"])
#     print("\nend scatter\n")
#     return jsonify(**context)
#
#
# @gnl.app.errorhandler(404)
# def not_found(error):
#     return make_response(jsonify({"message": "Not Found", "status_code": 404}), 404)
#
#
# @gnl.app.errorhandler(403)
# def forbidden(error):
#     return make_response(jsonify({"message": "Forbidden", "status_code": 403}), 403)
#
#
# @gnl.app.errorhandler(400)
# def bad_request(error):
#     return make_response(jsonify({"message": "Bad Request", "status_code": 400}), 400)
#
#
# @gnl.app.route('/api/v1/', methods=["GET"])
# def get_api_urls():
#     if "username" not in flask.session:
#         flask.abort(403)
#     context = {"posts": "/api/v1/p/", "url": "/api/v1/"}
#     return jsonify(**context)
#
#
# @gnl.app.route('/api/v1/p/', methods=["GET"])
# def get_newest_posts():
#     if "username" not in flask.session:
#         flask.abort(403)
#     size = request.args.get('size', default=10, type=int)
#     page = request.args.get('page', default=0, type=int)
#     if size < 0 or page < 0:
#         flask.abort(400)
#     logname = flask.session['username']
#     data = gnl.model.get_db()
#     cur = data.execute('SELECT DISTINCT postid '
#                        'FROM (SELECT username2 FROM following WHERE'
#                        ' username1 = ?) f INNER JOIN posts ON f'
#                        '.username2 = owner OR owner=? '
#                        'ORDER BY postid DESC',
#                        [logname, logname])
#     postlist = cur.fetchall()
#     if len(postlist) <= size * (page + 1):
#         next_page = ""
#     else:
#         next_page = flask.request.path + "?size=" + str(size) + "&page=" + str(page + 1)
#     head_ind = size * page
#     if len(postlist) > head_ind:
#         # page exists
#         if len(postlist) > head_ind + size:
#             # more than enough
#             postlist = postlist[head_ind:head_ind + size]
#         else:
#             # no more than one page
#             postlist = postlist[head_ind:]
#     else:
#         # no page
#         postlist = []
#     results = []
#     for each in postlist:
#         each.update({"url": flask.request.path + str(each["postid"]) + "/"})
#
#     context = {"next": next_page, "results": postlist, "url": flask.request.path}
#     # print("DEBUG ",context)
#     return jsonify(**context)
#
#
# @gnl.app.route('/api/v1/p/<int:postid_url_slug>/', methods=["GET"])
# def get_post(postid_url_slug):
#     if "username" not in flask.session:
#         flask.abort(403)
#     context = {}
#     connection = gnl.model.get_db()
#     cur = connection.execute(
#         "SELECT created AS age, filename AS img_url, owner FROM posts WHERE postid = ? ",
#         (postid_url_slug,)
#     )
#     temp = cur.fetchone()
#     if not temp:
#         flask.abort(404)
#
#     temp['img_url'] = "/uploads/" + temp['img_url']
#
#     cur = connection.execute(
#         "SELECT filename AS owner_img_url FROM users WHERE username = ? ",
#         (temp['owner'],)
#     )
#     owner_img = cur.fetchone()
#     owner_img["owner_img_url"] = "/uploads/" + owner_img["owner_img_url"]
#     temp.update(owner_img)
#     context.update(temp)
#     context["owner_show_url"] = "/u/" + temp['owner'] + "/"
#     context["post_show_url"] = "/p/" + str(postid_url_slug) + "/"
#     context["url"] = flask.request.path
#     return jsonify(**context)
#
#
# @gnl.app.route('/api/v1/p/<int:postid_url_slug>/comments/', methods=["GET"])
# def get_comments(postid_url_slug):
#     if "username" not in flask.session:
#         flask.abort(403)
#     connection = gnl.model.get_db()
#
#     # see if post out of range
#     cur = connection.execute(
#         "SELECT owner FROM posts WHERE postid = ? ",
#         (postid_url_slug,)
#     )
#     temp = cur.fetchone()
#     if not temp:
#         flask.abort(404)
#
#     cur = connection.execute("SELECT commentid, owner, text FROM comments WHERE postid = ? ",
#                              (postid_url_slug,)
#                              )
#     # fetchall is a list of dictionaries
#     temp = cur.fetchall()
#     for each in temp:
#         # each is a dictionary
#         each.update({"postid": postid_url_slug, "owner_show_url": "/u/" + each["owner"] + "/"})
#     context = {"comments": temp, "url": flask.request.path}
#     return jsonify(**context)
#
#
# @gnl.app.route('/api/v1/p/<int:postid_url_slug>/comments/', methods=["POST"])
# def post_comments(postid_url_slug):
#     if "username" not in flask.session:
#         flask.abort(403)
#     if not request.json or not 'text' in request.json:
#         flask.abort(400)
#     data = gnl.model.get_db()
#
#     # see if post out of range
#     cur = data.execute(
#         "SELECT owner FROM posts WHERE postid = ? ",
#         (postid_url_slug,)
#     )
#     temp = cur.fetchone()
#     if not temp:
#         flask.abort(404)
#
#     # see if there are 0 comments for all posts
#     cur = data.execute('SELECT * FROM comments')
#     temp = cur.fetchall()
#     if not temp:
#         # no comments before
#         max_id = 1
#     else:
#         cur = data.execute('SELECT MAX(commentid) AS max_id '
#                            'FROM comments')
#         temp_max = cur.fetchall()
#         max_id = temp_max[0]['max_id'] + 1
#     data.execute('INSERT INTO comments (commentid, owner, '
#                  'postid, text) VALUES (?,?,?,?)',
#                  [max_id, flask.session['username'],
#                   postid_url_slug, request.json['text']])
#     cur = data.execute("SELECT commentid, owner, text FROM comments WHERE commentid = ? ",
#                        (max_id,)
#                        )
#     context = cur.fetchone()
#     context.update({"postid": postid_url_slug, "owner_show_url": "/u/" + context["owner"] + "/"})
#     resp = flask.jsonify(context)
#     resp.status_code = 201
#     return resp
#
#
# @gnl.app.route('/api/v1/p/<int:postid_url_slug>/likes/', methods=["GET"])
# def get_likes(postid_url_slug):
#     """Return likes on postid.
#
#     Example:
#     {
#       "logname_likes_this": 1,
#       "likes_count": 3,
#       "postid": 1,
#       "url": "/api/v1/p/1/likes/"
#     }
#     """
#
#     """ we assume 'username' is stored in the session, not logname"""
#     if "username" not in flask.session:
#         flask.abort(403)
#
#     # User
#     logname = flask.session["username"]
#     context = {}
#
#     # url
#     context["url"] = flask.request.path
#
#     # Post
#     postid = postid_url_slug
#     context["postid"] = postid
#
#     connection = gnl.model.get_db()
#
#     # see if post out of range
#     cur = connection.execute(
#         "SELECT owner FROM posts WHERE postid = ? ",
#         (postid,)
#     )
#     temp = cur.fetchone()
#     if not temp:
#         flask.abort(404)
#
#     # Did this user like this post?
#     cur = connection.execute(
#         "SELECT EXISTS( "
#         "  SELECT 1 FROM likes "
#         "    WHERE postid = ? "
#         "    AND owner = ? "
#         "    LIMIT 1"
#         ") AS logname_likes_this ",
#         (postid, logname)
#     )
#     logname_likes_this = cur.fetchone()
#     context.update(logname_likes_this)
#
#     # Likes
#     cur = connection.execute(
#         "SELECT COUNT(*) AS likes_count FROM likes WHERE postid = ? ",
#         (postid,)
#     )
#     likes_count = cur.fetchone()
#     context.update(likes_count)
#
#     return jsonify(**context)
#
#
# @gnl.app.route('/api/v1/p/<int:postid_url_slug>/likes/', methods=["DELETE"])
# def delete_likes(postid_url_slug):
#     # delete out of range???????????????????
#     if "username" not in flask.session:
#         flask.abort(403)
#     data = gnl.model.get_db()
#
#     # see if post out of range
#     cur = data.execute(
#         "SELECT owner FROM posts WHERE postid = ? ",
#         (postid_url_slug,)
#     )
#     temp = cur.fetchone()
#     if not temp:
#         flask.abort(404)
#
#     data.execute('DELETE FROM likes WHERE owner = ? and postid=?',
#                  [flask.session['username'], postid_url_slug])
#     resp = flask.jsonify({})
#     resp.status_code = 204
#     return resp
#
#
# @gnl.app.route('/api/v1/p/<int:postid_url_slug>/likes/', methods=["POST"])
# def post_likes(postid_url_slug):
#     if "username" not in flask.session:
#         flask.abort(403)
#     data = gnl.model.get_db()
#     logname = flask.session['username']
#     context = {"logname": logname, "postid": postid_url_slug}
#
#     # see if post out of range
#     cur = data.execute(
#         "SELECT owner FROM posts WHERE postid = ? ",
#         (postid_url_slug,)
#     )
#     temp = cur.fetchone()
#     if not temp:
#         flask.abort(404)
#
#     # did logname like this?
#     cur = data.execute(
#         "SELECT EXISTS( "
#         "  SELECT 1 FROM likes "
#         "    WHERE postid = ? "
#         "    AND owner = ? "
#         "    LIMIT 1"
#         ") AS logname_likes_this ",
#         (postid_url_slug, logname)
#     )
#     logname_likes_this = cur.fetchone()
#     if len(logname_likes_this) == 0:
#         flask.abort(404)
#
#     if logname_likes_this["logname_likes_this"] == 0:
#         data.execute('INSERT INTO likes (owner, postid) VALUES(?,?)',
#                      [logname, postid_url_slug])
#         resp = flask.jsonify(context)
#         resp.status_code = 201
#     else:
#         context.update({"message": "Conflict", "status_code": 409})
#         resp = flask.jsonify(context)
#         resp.status_code = 409
#     return resp
import pandas as pd

from  jpype import *
import os
# print(os.listdir)
# os.chdir("D:\\")''



import numpy as np
from gnl.views import helper

data = [[np.nan,10, "wf"],['1',12, "NaN"],['Clarke',13, "wef"]]
df = pd.DataFrame(data,columns=['Name','Age', "Hello"])

print(df["Name"][0])
exit(0)
df.drop(columns=["Age"], inplace=True)

valid_cols, valid_col_indices, cardinality, categories = [], [], [], []

for i, col in enumerate(list(df)):
    if len(set(list(df[col])))<=9:
        valid_cols.append(col)
        valid_col_indices.append(i)

        cardinality.append(len(set(list(df[col]))))
        # encoding valid categorical columns
        labels, uniques = pd.factorize(list(df[col]), sort=True)
        df[col]=labels
        categories.append(uniques)
print(valid_cols, valid_col_indices, categories)
print(df)

cpopt = "-Djava.class.path=%s" % ("CoverageJava/target/classes")
startJVM(getDefaultJVMPath(), "-ea", cpopt)
print(getDefaultJVMPath())
print("classpath:", cpopt)

dataset = JClass('io.DataSet')
hybrid = JClass('search.HybridSearch')


df.to_csv("hello.csv")
print(valid_cols, valid_col_indices, cardinality, categories)

dataset1 = dataset("hello.csv", cardinality, valid_col_indices, df.shape[0])
hybrid1 = hybrid(dataset1)
a = hybrid1.findMaxUncoveredPatternSet(1, 2)
mups = [i.getStr() for i in a]
uncovered_patterns = []
# print("hello")
# print(mups)

for i, mup in enumerate(mups):
    # print("mup:", mup)
    # print(type(mup[0]))

    uncovered_patterns.append(
        " ".join([categories[j][ord(char) - ord('0')] for j, char in enumerate(mup) if char != 'x']))
print(uncovered_patterns)
exit(0)

p=os.path.join(
    os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
    'CoverageJava'
)
print(p)
cpopt = "-Djava.class.path=%s" % (os.path.join(p, "target","classes"))

startJVM(getDefaultJVMPath(), "-ea", cpopt)

print(getDefaultJVMPath())
print("classpath:", cpopt)
dataset = JClass('io.DataSet')
hybrid = JClass('search.HybridSearch')
dataset1 = dataset(os.path.join(p, "data","airbnb_100000.csv"),
                   [3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
                    2, 2, 2, 2, 2, 2, 2, 2, 2, 2][0:15], [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                                                          17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30][0:15],
                   100000)

hybrid1 = hybrid(dataset1)
print(hybrid1.findMaxUncoveredPatternSet(500))
shutdownJVM()



exit(0)
d = {'col1': [1, 2,4,1], 'col2': [0,9, 3, 4], 'col3': ["e", "e", "dfe","e"]}
df = pd.DataFrame(data=d)
# df=df[df['col2'].between(2, 6.3, inclusive=True)]
print(type(df["col3"][0]))

exit(0)
def is_float(text):
    try:
        if(type(text)==int or type(text)==float): return True
        float(text)
        # check for nan/infinity etc.
        if text.isalpha():
            return False
        return True
    except ValueError:
        return False

def is_float_or_int(text):
    try:
        if(type(text)==int or type(text)==float):
            return True
        float(text)
        return True
    except ValueError:
        print("Not a valid int or float")
        return False

is_float_or_int("1.")


exit(0)

class TreeNode:
    def __init__(self, val, left=None, right=None, parent=None):
        self.val = val
        self.leftChild = left
        self.rightChild = right
        self.parent = parent
        self.is_val = False

    def traverse(self):
        if not self: return
        if self.leftChild:
            self.leftChild.traverse()
        print(self.val)
        if self.rightChild:
            self.rightChild.traverse()

# Complete the decode function below.
def decode(codes, encoded):
    root = TreeNode("0")
    for temp in codes:
        letter,code = temp.split("\t")
        curNode = root
        for i in range(len(code)):
            if code[i] == "1":
                if not curNode.rightChild:
                    curNode.rightChild = TreeNode("1")
                curNode = curNode.rightChild
            elif code[i] == "0":
                if not curNode.leftChild:
                    curNode.leftChild = TreeNode("0")
                curNode = curNode.leftChild
        curNode.leftChild = TreeNode(letter)
        curNode.leftChild.is_val = True
    curNode = root
    res = ""
    for i, value in enumerate(encoded):
        curNode = curNode.rightChild if value == "1" else curNode.leftChild
        if curNode.leftChild and curNode.leftChild.is_val:
            res += "\n" if curNode.leftChild.val == "[newline]" else curNode.leftChild.val
            curNode = root
    return res

codes=["a\t100100","b\t100101","c\t110001","d\t100000", "[newline]\t111111","p\t111110","q\t000001"]
encoded="111110000001100100111111100101110001111110"


print(decode(codes, encoded))
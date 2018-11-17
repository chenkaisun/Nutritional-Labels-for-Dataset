"""
An example file of applying TANE algorithm to table
"""

# from utils.preprocessor import Preprocessor
# from utils.reader import Reader
# from utils.writer import Writer
#
# from algorithm.tane import TANE
#
# __author__ = 'Ma Zijun'
# __date__ = '2017-04-23'
#
# if __name__ == "__main__":
#     preprocessor = Preprocessor()
#     input_file_name, output_file_name, breaker = preprocessor.get_options()
#
#     table = Reader.read_table_from_file(input_file_name, breaker)
#
#     tane = TANE(table)
#     tane.run()
#
#     Writer.write_dependency_to_file(tane.ans, output_file_name)

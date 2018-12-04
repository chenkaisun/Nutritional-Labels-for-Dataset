"""
gnl python package configuration.

Chenkai Sun <sunchenk@umich.edu>
"""

from setuptools import setup

setup(
    name='gnl',
    version='0.1.0',
    packages=['gnl'],
    include_package_data=True,
    install_requires=[
        'Flask==0.12.2',
        'Flask-Testing==0.6.2',
        'requests==2.18.4',
        'pandas==0.23.0',
        'future==0.17.1',
        'unidecode==1.0.23',
        'dedupe==1.9.3',
        'nltk==3.4',
    ],
)

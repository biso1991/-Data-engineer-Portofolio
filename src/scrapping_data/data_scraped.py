import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
import nltk
# from sklearn.model_selection import train_test_split
# from sklearn.feature_extraction.text import TfidfVectorizer
import scipy.sparse
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.figure import Figure
from matplotlib.axes import Axes

# site : keepjob
home_page="https://www.keejob.com"

joblinks=[]
for i in range(1,5):
    # contact page 
    response=requests.get(f'https://www.keejob.com/offres-emploi/metiers/recrutement-informatique-multimedia/?page={i}')
    sp= BeautifulSoup(response.content,'lxml')
    joblist=sp.find_all("h6")
#     print(joblist)
    for item in joblist:
        for link in item.find_all('a',href=True):
#             print(link)
            joblinks.append(home_page+link['href'])
#             print(joblinks)
# print(joblinks)   
# https://www.keejob.com/offres-emploi/145382/data-scientist-hf/

testlink="https://www.keejob.com/offres-emploi/145382/data-scientist-hf/"

# import nltk
# nltk.download('punkt')
# nltk.download('stopwords')

jobs=[]
for link in joblinks:
    reponse=requests.get(link)
    sp=BeautifulSoup(reponse.content,"lxml")
    job_name=sp.find("h2",class_="job-title").text.strip()
    ps=sp.find("div", class_="text").text.replace('\n', '**').split('**')
    posted_on=ps[6]
    
    
    wk=[sp.find("div", class_="text").text.replace('\t', '').replace('\n','').replace(":","loc: ").strip()]
    place=[]
    for l in wk:
        place.append(re.findall("loc: \W+\w+\W+\w+",l,re.MULTILINE))
        
#     print(place)
#     Workplace= ' '.join(map(str, place))
    for j in place:
        for t in j:
            workplace=t
    
            workplace.replace(" ","")
#     print(workplace)
    ########################################################################
    st=[sp.find("div", class_="text").text.replace('\nBac','Bac').strip()]
    std=[]
    for i in st:
        std.append(re.findall("\w",i,re.MULTILINE))
    
    Study= ' '.join(map(str, std))
    #     print(Study)
    ########################################################################
    
    lg=[sp.find("div", class_="text").text.replace("\t","").replace("Langues:\n\n\n","-").replace("\n,\n\n",",")
       .replace("\n","-")]   
#     print(lg)
    LG=[]
    for i in lg:
        LG.append(re.findall("-[A-Za-z]+.?\w+,\w+-",i,re.MULTILINE))
#     print(LG)
    
#     Languages=st[33:34]+st[35:36]
    
    
    Languages= ' '.join(map(str, LG))
#     print(Languages)
    
    #################################################################################
    cmp=sp.find("div", class_="span9 content").text.replace('\n', '**').strip().split('**')
    # print(cmp)
    Company_name=cmp[2]
    Company_name= ' '.join(map(str, Company_name))
    # print(Company_name)
    Job_description=sp.find("div", class_="block_a span12 no-margin-left").text.replace('Imprimer','').replace('\t','').replace('«\xa0','').replace('-\xa0',' ').replace('\xa0','').replace('\n',' ').replace('\r',' ').split('**')
    Job_description = ' '.join(map(str, Job_description))
    sentence = nltk.sent_tokenize(Job_description)

    # print(sentence)
    # link_img=[]
    # img_cmp=sp.find_all('img')
    # link_img=[]
    # for image in img_cmp:

    #     link_img=image['src']
    # #     print(link_img)

    # #     print(link_img)
    # print(link_img)            



#     # print(name,"\n",posted_on,"\n",Workplace,"\n",Study,"\n",Languages,"\n",Company_name,"\n",Job_description)
    job={
         'job_name':job_name,
         'posted_on':posted_on,
         'workplace':workplace,
        'Study':Study,
         'Languages':Languages,
         'Company_name':Company_name,
         'Job_description':Job_description
    }
#     print(job)
 
    jobs.append(job)
    # print('saving job: ',jobs)

# formatted_article_text = re.sub('[^a-zA-Z]', ' ', sentence )
# formatted_article_text = re.sub(r'\s+', ' ', formatted_article_text)
# stopwords = nltk.corpus.stopwords.words('french')

# word_frequencies = {}
# for word in nltk.word_tokenize(formatted_article_text):
#     if word not in stopwords:
#         if word not in word_frequencies.keys():
#             word_frequencies[word] = 1
#         else:
#             word_frequencies[word] += 1

df = pd.DataFrame(jobs )
df.head()

df =pd.read_csv('jobs.csv')

df.to_csv('jobs.csv', index=False,header=None)
# 

df.shape

(60, 7)

df.rename(columns = {'job_name':'Target','Job_description':'Text' }, inplace = True)
df.head()


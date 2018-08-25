import os
import zipfile

# def un_zip(filename):
#     """unzip zip file"""
#     zip_file = zipfile.ZipFile(filename)
#     if os.path.isdir(filename + "_files"):
#         pass
#     else:
#         os.mkdir(filename + "_files")
#     for names in zip_file.namelist():
#         zip_file.extract(names,filename + "_files/")
#     zip_file.close()

# if __name__  == "__main__":
#     un_zip(snake)

try:
    with zipfile.ZipFile("/home/tarena/snake.zip") as zfile:
        s = zfile.extractall(path="/home/tarena")
except zipfile.BadZipFile as e:
    print (zfile_path+" is a bad zip file ,please check!")

os.system("/home/tarena/snake/snake.py")


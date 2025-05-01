import pandas as pd

# CSV 읽기
df = pd.read_csv('/mnt/nas-drive/pys/cuketmon/datasets/pokemon_data.csv')  # 파일명 수정!

# 삭제할 버전 목록
remove_versions = [
    'red-blue', 'yellow', 'crystal',
    'gold', 'silver', 'ruby-sapphire', 'x-y',
    'omegaruby-alphasapphire'
]

def has_remove_version(image):
    for version in remove_versions:
        if f"/{version}/" in image:
            return True
    return False

def has_shiny(image):
    return '/shiny/' in image

df = df[~df['image'].apply(has_remove_version)].reset_index(drop=True)

df = df[~df['image'].apply(has_shiny)].reset_index(drop=True)
if 'description' in df.columns:
    df = df.drop(columns=['description'])
if 'Unnamed: 0' in df.columns:
    df = df.drop(columns=['Unnamed: 0'])

df.to_csv('filtered_file.csv', index=False)

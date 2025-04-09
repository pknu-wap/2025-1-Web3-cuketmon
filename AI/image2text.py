import pandas as pd

parquet_file = r"/mnt/nas-drive/pys/cuketmon/datasets/train-00000-of-00001-566cc9b19d7203f8.parquet"
df_parquet = pd.read_parquet(parquet_file)

with open("output.png", "wb") as f:
    f.write(df_parquet["image"][7]["bytes"])
parquet_file = r"/mnt/nas-drive/pys/cuketmon/datasets/train-00000-of-00001-566cc9b19d7203f8.parquet"
df_parquet = pd.read_parquet(parquet_file)
df_parquet.to_csv("output.csv", index=False)
print(df_parquet.head(10))
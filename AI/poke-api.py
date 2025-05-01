import pokepy

client = pokepy.V2Client()

# 분홍색 포켓몬 정보 가져오기
pink_pokemon_list = client.get_pokemon_color('pink')

# 첫 번째 요소 가져오기
if isinstance(pink_pokemon_list, list) and len(pink_pokemon_list) > 0:
    pink_pokemon = pink_pokemon_list[0]  # 리스트의 첫 번째 요소 선택
else:
    print("Error: No data found.")
    exit()

# pokemon_species 속성이 존재하는지 확인 후 출력
if hasattr(pink_pokemon, 'pokemon_species'):
    print([pokemon.name for pokemon in pink_pokemon.pokemon_species])
else:
    print("Error: pokemon_species attribute not found.")

import requests

# PokéAPI에서 모든 포켓몬 목록 가져오기
pokemon_url = "https://pokeapi.co/api/v2/pokemon?limit=10000"
response = requests.get(pokemon_url)

if response.status_code == 200:
    all_pokemon = response.json()["results"]
    
    # 각 포켓몬의 색상을 확인
    for pokemon in all_pokemon[:10]:  # 테스트를 위해 10개만 출력
        name = pokemon["name"]
        color_url = f"https://pokeapi.co/api/v2/pokemon-shape/{name}/"
        color_response = requests.get(color_url)

        if color_response.status_code == 200:
            color_data = color_response.json()
            color = color_data.get("color", {}).get("name", "Unknown")
            print(f"{name}: {color}")
        else:
            print(f"{name}: Color Not Found")
else:
    print("Failed to fetch Pokémon list.")

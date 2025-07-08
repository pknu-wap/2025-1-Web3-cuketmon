const typeData = {
    normal: {
      korean: '노말',
      color: '#C1C2C1',
      id: 1,
      double_damage_from: ['fighting'],
      double_damage_to: [],
      half_damage_from: [],
      half_damage_to: [
        'rock',
        'steel'
      ],
      no_damage_from: [
        'ghost'
      ],
      no_damage_to: [
        'ghost'
      ],
      image_url: "https://archives.bulbagarden.net/media/upload/2/28/NormalIC_BW.png"
    },

    fire: {
      korean: '불꽃',
      color: '#EF7374',
      id: 10,
      double_damage_from: [
        'ground',
        'rock',
        'water'
      ],
      double_damage_to: [
        'bug',
        'steel',
        'grass',
        'ice'
      ],
      half_damage_from: [
        'bug',
        'steel',
        'fire',
        'grass',
        'ice',
        'fairy'
      ],
      half_damage_to: [
        'rock',
        'fire',
        'water',
        'dragon'
      ],
      no_damage_from: [],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/1/15/FireIC_BW.png"
    },

    water: {
      korean: '물',
      color: '#6794F7',
      id: 11,
      double_damage_from: [
        'grass',
        'electric'
      ],
      double_damage_to: [
        'ground',
        'rock',
        'fire'
      ],
      half_damage_from: [
        'steel',
        'fire',
        'water',
        'ice'
      ],
      half_damage_to: [
        'water',
        'grass',
        'dragon'
      ],
      no_damage_from: [],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/2/2b/WaterIC_BW.png"
    },

    electric: {
      korean: '전기',
      color: '#FCD659',
      id: 13,
      double_damage_from: [
        'ground'
      ],
      double_damage_to: [
        'flying',
        'water'
      ],
      half_damage_from: [
        'flying',
        'steel',
        'electric'
      ],
      half_damage_to: [
        'grass',
        'electric',
        'dragon'
      ],
      no_damage_from: [],
      no_damage_to: [
        'ground'
      ],
      image_url:"https://archives.bulbagarden.net/media/upload/6/67/ElectricIC_BW.png"
    },

    grass: {
      korean: '풀',
      color: '#82C274',
      id: 12,
      double_damage_from: [
        'flying',
        'poison',
        'bug',
        'fire',
        'ice'
      ],
      double_damage_to: [
        'ground',
        'rock',
        'water'
      ],
      half_damage_from: [
        'ground',
        'water',
        'grass',
        'electric'
      ],
      half_damage_to: [
        'flying',
        'poison',
        'bug',
        'steel',
        'fire',
        'grass',
        'dragon'
      ],
      no_damage_from: [],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/2/23/GrassIC_BW.png"
    },

    ice: {
      korean: '얼음',
      color: '#81DF77',
      id: 15,
      double_damage_from: [
        'fighting',
        'rock',
        'steel',
        'fire'
      ],
      double_damage_to: [
        'flying',
        'ground',
        'grass',
        'dragon'
      ],
      half_damage_from: [
        'ice'
      ],
      half_damage_to: [
        'steel',
        'fire',
        'water',
        'ice'
      ],
      no_damage_from: [],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/a/ad/IceIC_BW.png"
    },

    fighting: {
      korean: '격투',
      color: '#FFAC59',
      id: 2,
      double_damage_from: [
        'flying',
        'psychic',
        'fairy'
      ],
      double_damage_to: [
        'normal',
        'rock',
        'steel',
        'ice',
        'dark'
      ],
      half_damage_from: [
        'rock',
        'bug',
        'dark'
      ],
      half_damage_to: [
        'flying',
        'poison',
        'bug',
        'psychic',
        'fairy'
      ],
      no_damage_from: [],
      no_damage_to: [
        'ghost'
      ],
      image_url:"https://archives.bulbagarden.net/media/upload/c/c8/FightingIC_BW.png"
    },

    poison: {
      korean: '독',
      color: '#B884DD',
      id: 4,
      double_damage_from: [
        'ground',
        'psychic'
      ],
      double_damage_to: [
        'grass',
        'fairy'
      ],
      half_damage_from: [
        'fighting',
        'poison',
        'bug',
        'grass',
        'fairy'
      ],
      half_damage_to: [
        'poison',
        'ground',
        'rock',
        'ghost'
      ],
      no_damage_from: [],
      no_damage_to: [
        'steel'
      ],
      image_url:"https://archives.bulbagarden.net/media/upload/b/ba/PoisonIC_BW.png"
    },
    
    ground: {
      korean: '땅',
      color: '#B88E6F',
      id: 5,
      double_damage_from: [
        'water',
        'grass',
        'ice'
      ],
      double_damage_to: [
        'poison',
        'rock',
        'steel',
        'fire',
        'electric'
      ],
      half_damage_from: [
        'poison',
        'rock'
      ],
      half_damage_to: [
        'bug',
        'grass'
      ],
      no_damage_from: [
        'electric'
      ],
      no_damage_to: [
        'flying'
      ],
      image_url:"https://archives.bulbagarden.net/media/upload/f/f4/GroundIC_BW.png"
    },

    flying: {
      korean: '비행',
      color: '#ADD2F5',
      id: 3,
      double_damage_from: [
        'rock',
        'electric',
        'ice'
      ],
      double_damage_to: [
        'fighting',
        'bug',
        'grass'
      ],
      half_damage_from: [
        'fighting',
        'bug',
        'grass'
      ],
      half_damage_to: [
        'rock',
        'steel',
        'electric'
      ],
      no_damage_from: [
        'ground'
      ],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/8/8e/FlyingIC_BW.png"
    },

    psychic: {
      korean: '에스퍼',
      color: '#F584A8',
      id: 14,
      double_damage_from: [
        'bug',
        'ghost',
        'dark'
      ],
      double_damage_to: [
        'fighting',
        'poison'
      ],
      half_damage_from: [
        'fighting',
        'psychic'
      ],
      half_damage_to: [
        'steel',
        'psychic'
      ],
      no_damage_from: [],
      no_damage_to: [
        'dark'
      ],
      image_url:"https://archives.bulbagarden.net/media/upload/6/60/PsychicIC_BW.png"
    },
    
    bug: {
      korean: '벌레',
      color: '#B8C26A',
      id: 7,
      double_damage_from: [
        'flying',
        'rock',
        'fire'
      ],
      double_damage_to: [
        'grass',
        'psychic',
        'dark'
      ],
      half_damage_from: [
        'fighting',
        'ground',
        'grass'
      ],
      half_damage_to: [
        'fighting',
        'flying',
        'poison',
        'ghost',
        'steel',
        'fire',
        'fairy'
      ],
      no_damage_from: [],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/2/2e/BugIC_BW.png"
    },

    rock: {
      korean: '바위',
      color: '#CBC7AD',
      id: 6,
      double_damage_from: [
        'fighting',
        'ground',
        'steel',
        'water',
        'grass'
      ],
      double_damage_to: [
        'flying',
        'bug',
        'fire',
        'ice'
      ],
      half_damage_from: [
        'normal',
        'flying',
        'poison',
        'fire'
      ],
      half_damage_to: [
        'fighting',
        'ground',
        'steel'
      ],
      no_damage_from: [],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/8/85/RockIC_BW.png"
    },

    ghost: {
      korean: '고스트',
      color: '#A284A2',
      id: 8,
      double_damage_from: [
        'ghost',
        'dark'
      ],
      double_damage_to: [
        'ghost',
        'psychic'
      ],
      half_damage_from: [
        'poison',
        'bug'
      ],
      half_damage_to: [
        'dark'
      ],
      no_damage_from: [
        'normal',
        'fighting'
      ],
      no_damage_to: [
        'normal'
      ],
      image_url:"https://archives.bulbagarden.net/media/upload/8/85/RockIC_BW.png"
    },

    dragon: {
      korean: '드래곤',
      color: '#8D98EC',
      id: 16,
      double_damage_from: [
        'ice',
        'dragon',
        'fairy'
      ],
      double_damage_to: [
        'dragon'
      ],
      half_damage_from: [
        'fire',
        'water',
        'grass',
        'electric'
      ],
      half_damage_to: [
        'steel'
      ],
      no_damage_from: [],
      no_damage_to: [
        'fairy'
      ],
      image_url:"https://archives.bulbagarden.net/media/upload/a/ad/DragonIC_BW.png"
    },

    dark: {
      korean: '악',
      color: '#998B8C',
      id: 17,
      double_damage_from: [
        'fighting',
        'bug',
        'fairy'
      ],
      double_damage_to: [
        'ghost',
        'psychic'
      ],
      half_damage_from: [
        'ghost',
        'dark'
      ],
      half_damage_to: [
        'fighting',
        'dark',
        'fairy'
      ],
      no_damage_from: [
        'psychic'
      ],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/3/35/DarkIC_BW.png"
    
    },

    steel: {
      korean: '강철',
      color: '#98C2D1',
      id: 9,
      double_damage_from: [
        'fighting',
        'ground',
        'fire'
      ],
      double_damage_to: [
        'rock',
        'ice',
        'fairy'
      ],
      half_damage_from: [
        'normal',
        'flying',
        'rock',
        'bug',
        'steel',
        'grass',
        'psychic',
        'ice',
        'dragon',
        'fairy'
      ],
      half_damage_to: [
        'steel',
        'fire',
        'water',
        'electric'
      ],
      no_damage_from: [
        'poison'
      ],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/0/04/SteelIC_BW.png"
    },

    fairy: {
      korean: '페어리',
      color: '#F5A2F5',
      id: 18,
      double_damage_from: [
        'poison',
        'steel'
      ],
      double_damage_to: [
        'fighting',
        'dragon',
        'dark'
      ],
      half_damage_from: [
        'fighting',
        'bug',
        'dark'
      ],
      half_damage_to: [
        'poison',
        'steel',
        'fire'
      ],
      no_damage_from: [
        'dragon'
      ],
      no_damage_to: [],
      image_url:"https://archives.bulbagarden.net/media/upload/thumb/5/5d/FairyIC_Tera.png/140px-FairyIC_Tera.png"
    }
}
  export default typeData;
  
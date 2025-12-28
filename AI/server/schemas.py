from pydantic import BaseModel
from typing import Optional

class MonsterCreate(BaseModel):
    id: int
    affinity: Optional[int] = None
    attack: Optional[int] = None
    defence: Optional[int] = None
    hp: Optional[int] = None
    image: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    skill_id1: Optional[int] = None
    skill_id2: Optional[int] = None
    skill_id3: Optional[int] = None
    skill_id4: Optional[int] = None
    special_attack: Optional[int] = None
    special_defence: Optional[int] = None
    speed: Optional[int] = None
    type1: Optional[str] = None
    type2: Optional[str] = None

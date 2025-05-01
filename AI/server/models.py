from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.mysql import MEDIUMTEXT

Base = declarative_base()

class MonsterTable(Base):
    __tablename__ = "monster"

    id = Column(Integer, primary_key=True, index=True)
    affinity = Column(Integer, nullable=True)
    attack = Column(Integer, nullable=True)
    defence = Column(Integer, nullable=True)
    hp = Column(Integer, nullable=True)
    image = Column(MEDIUMTEXT, nullable=True)
    name = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    skill_id1 = Column(Integer, nullable=True)
    skill_id2 = Column(Integer, nullable=True)
    skill_id3 = Column(Integer, nullable=True)
    skill_id4 = Column(Integer, nullable=True)
    special_attack = Column(Integer, nullable=True)
    special_defence = Column(Integer, nullable=True)
    speed = Column(Integer, nullable=True)
    type1 = Column(String, nullable=True)
    type2 = Column(String, nullable=True)

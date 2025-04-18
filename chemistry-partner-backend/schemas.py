from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

# Paper schemas
class PaperBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    price: float

class PaperCreate(PaperBase):
    pass

class Paper(PaperBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        orm_mode = True

# Submission schemas
class SubmissionBase(BaseModel):
    score: float
    answers: Optional[str] = None
    paper_id: int

class SubmissionCreate(SubmissionBase):
    pass

class Submission(SubmissionBase):
    id: int
    submitted_at: datetime
    user_id: int

    class Config:
        orm_mode = True
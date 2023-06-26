from datetime import datetime
from pydantic import BaseModel
from typing import List, Union


class AudioURLs(BaseModel):
    url: str
    timestamp: Union[datetime, None] = None
    name: str = ''
    mobile: str = ''

class Item(BaseModel):
    id : str
    prompt: str
    prompt_timestamp: datetime
    audio_url: List[AudioURLs] = []

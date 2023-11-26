"""add company structer

Revision ID: 6ab3d4ed196f
Revises: 09e71c7acfee
Create Date: 2023-11-16 20:57:38.758164

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6ab3d4ed196f'
down_revision: Union[str, None] = '09e71c7acfee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

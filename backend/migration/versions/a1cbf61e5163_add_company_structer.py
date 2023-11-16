"""add company structer

Revision ID: a1cbf61e5163
Revises: 01b078e3d264
Create Date: 2023-11-16 21:01:10.711845

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1cbf61e5163'
down_revision: Union[str, None] = '01b078e3d264'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

"""add company structer

Revision ID: 01b078e3d264
Revises: 4f4f5a82f4a1
Create Date: 2023-11-16 21:00:37.066979

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '01b078e3d264'
down_revision: Union[str, None] = '4f4f5a82f4a1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

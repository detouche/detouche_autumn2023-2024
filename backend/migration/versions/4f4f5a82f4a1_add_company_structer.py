"""add company structer

Revision ID: 4f4f5a82f4a1
Revises: 6ab3d4ed196f
Create Date: 2023-11-16 20:59:29.970490

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4f4f5a82f4a1'
down_revision: Union[str, None] = '6ab3d4ed196f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

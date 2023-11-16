"""add company structer

Revision ID: 753f3e854b95
Revises: e53bc72d8a6d
Create Date: 2023-11-16 21:02:59.980499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '753f3e854b95'
down_revision: Union[str, None] = 'e53bc72d8a6d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

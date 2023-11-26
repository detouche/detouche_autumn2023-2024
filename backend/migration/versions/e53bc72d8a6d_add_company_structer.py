"""add company structer

Revision ID: e53bc72d8a6d
Revises: a1cbf61e5163
Create Date: 2023-11-16 21:01:57.923338

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e53bc72d8a6d'
down_revision: Union[str, None] = 'a1cbf61e5163'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass

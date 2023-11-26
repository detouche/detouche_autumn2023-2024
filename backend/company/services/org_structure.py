from fastapi import APIRouter, UploadFile, Response

from company.services.export_org_structure import export_org_structure
from company.services.import_org_structure import import_org_structure

org_router = APIRouter(prefix='/org', tags=['org-structure'])


@org_router.post("/structure-upload")
async def structure_upload(file: UploadFile):
    parsed_structure = await import_org_structure(file.file)
    return {
        "filename": file.filename,
        "parsed_structure": parsed_structure
    }


@org_router.get("/structure-export")
async def structure_export():
    buffer = await export_org_structure()
    return Response(buffer.getvalue(),
                    media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={'Content-Disposition': 'attachment; filename="filename.xlsx"'})

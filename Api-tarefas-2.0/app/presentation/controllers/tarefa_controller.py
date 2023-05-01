from fastapi import APIRouter, Depends, HTTPException, status

from app.persistence.tarefa_mongodb_repository import TarefasMongoDBRepository
from app.persistence.tarefa_repository import tarefaInMemoryRepository

from ..auth_utils import obter_usuario_logado
from ..viewmodels import Tarefa, UsuarioSimples

print('Tarefas Controllers')
routes = APIRouter()
prefix = '/tarefas'

# Banco de Dados
# filme_repository = FilmeInMemoryRepository()
tarefa_repository = TarefasMongoDBRepository()


@routes.get('/')
def todas_tarefas(
        skip: int | None = 0,
        take: int | None = 0,
        usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    tarefas = tarefa_repository.todos(skip, take)
    tarefas_usuario = list(
        filter(lambda tarefa: tarefa.usuario_id == usuario.id, tarefas))
    return tarefas_usuario


@routes.get('/{tarefa_id}')
def obter_tarefa(tarefa_id: int | str, usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    tarefa = tarefa_repository.obter_um(tarefa_id)

    # fail fast
    if not tarefa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Não existe tarefa com ID: = {tarefa_id }')

    if tarefa.usuario_id != usuario.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrada")

    return tarefa


@routes.post('/', status_code=status.HTTP_201_CREATED)
def nova_tarefa(tarefa: Tarefa, usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    tarefa.usuario_id = usuario.id
    return tarefa_repository.salvar(tarefa)


@routes.delete("/{tarefa_id}",
               status_code=status.HTTP_204_NO_CONTENT)
def remover_tarefa(tarefa_id: int | str, usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    tarefa = tarefa_repository.obter_um(tarefa_id)

    if not tarefa:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrada")

    if tarefa.usuario_id != usuario.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrada")

    tarefa_repository.remover(tarefa_id)


@routes.put('/{tarefa_id}')
def atualizar_tarefa(tarefa_id: int | str, tarefa: Tarefa, usuario: UsuarioSimples = Depends(obter_usuario_logado)):
    tarefa_encontrada = tarefa_repository.obter_um(tarefa_id)

    if not tarefa_encontrada:
        raise HTTPException(status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrada")

    if tarefa_encontrada.usuario_id != usuario.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Tarefa não encontrado!")

    tarefa.usuario_id = usuario.id

    return tarefa_repository.atualizar(tarefa_id, tarefa)

from bson.objectid import ObjectId
from pydantic import BaseModel, EmailStr, Field


class Tarefa(BaseModel):
    id: int | None | str
    descricao: str
    situacao: str
    nivel: int
    responsavel : str | None
    prioridade: int
    usuario_id: int | str | None

    class Config:
        orm_mode = True

    @classmethod
    def fromDict(cls, tarefa_dict):
        tarefa_ = Tarefa(id=str(tarefa_dict['_id']),
                       descricao=tarefa_dict['descricao'],
                       situacao=tarefa_dict['situacao'],
                       nivel=tarefa_dict['nivel'],
                       prioridade=tarefa_dict['prioridade'],
                       usuario_id=str(tarefa_dict['usuario_id']))
        return tarefa_

    def toDict(self):
        return {
            "descricao": self.descricao,
            "situacao": self.situacao,
            "nivel": self.nivel,
            "prioridade": self.prioridade,
            "responsavel": self.responsavel,
            "usuario_id": self.usuario_id
        }


class UsuarioSimples(BaseModel):
    id: int | None | str
    nome: str = Field(min_length=5)
    usuario: str = Field(min_length=5)
    email: EmailStr

    def toDict(self):
        return {
            "nome": self.nome,
            "usuario": self.usuario,
            "email": self.email,
            "senha": self.senha,
        }


class Usuario(UsuarioSimples):
    senha: str = Field(min_length=6)

    @classmethod
    def fromDict(cls, usuario_dict):
        return Usuario(**usuario_dict, id=str(usuario_dict['_id']))


class CriarUsuario(Usuario):
    confirmacao_senha: str


class LoginData(BaseModel):
    usuario: str = Field(min_length=5)
    senha: str = Field(min_length=6)

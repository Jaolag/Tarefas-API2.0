class tarefaInMemoryRepository():

    def __init__(self):
        self.tarefas = []
        self.proximo_id = 1

    def todos(self, skip, take):
        inicio = skip

        if skip and take:
            fim = skip + take
        else:
            fim = None

        return self.tarefas[inicio:fim]

    def salvar(self, tarefa):
        tarefa.id = self.proximo_id
        self.proximo_id += 1
        self.tarefas.append(tarefa)

        return tarefa

    def obter_um(self, tarefa_id):
        for tarefa in self.tarefas:
            if tarefa.id == tarefa_id:
                return tarefa

        return None

    def remover(self, tarefa_id):
        tarefa = self.obter_um(tarefa_id)
        if tarefa:
            self.tarefas.remove(tarefa)

    def atualizar(self, tarefa_id, tarefa):
        for index in range(len(self.tarefas)):
            tarefa_atual = self.tarefas[index]
            if tarefa_atual.id == tarefa_id:
                tarefa.id = tarefa_atual.id
                self.tarefas[index] = tarefa
                return tarefa

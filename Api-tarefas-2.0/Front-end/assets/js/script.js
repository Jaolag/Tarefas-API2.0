// const baseURL = 'https://app-filmes-tds-366-2023-1.onrender.com/filmes'
const baseURL = "http://localhost:8000/tarefas"

let tarefas = []
let editing = false
let tarefa_id
const token = `Bearer ${localStorage.getItem("token_tarefas")}`

function resetar_formulario() {
  const form_tarefa = document.getElementById("form-tarefa")
  form_tarefa.reset()

  const btn_confirmar = document.getElementById("btn-confirmar")
  btn_confirmar.value = "Adicionar Tarefa"

  editing = false
}

function atualizar_tela() {
  // Manipulacao de DOM
  const ul_tarefa = document.getElementById("list-tarefas")
  ul_tarefa.innerHTML = []

  for (let tarefa of tarefas) {
    const item = document.createElement("tr")
    // const label = '#'+filme.id+' - '+filme.nome + ' - ' + filme.genero
    const label = `#${tarefa.id} - ${tarefa.descricao} -  ${tarefa.responsavel}  - ${tarefa.nivel} - ${tarefa.prioridade} - ${tarefa.situacao}`

    const btn_editar = document.createElement("a") // <a></a>
    btn_editar.innerText = "Editar" // <a>Editar</a>
    btn_editar.href = "#"

    btn_editar.onclick = (event) => {
      event.preventDefault()

      // 1. Preencher o Formulário
      preencher_formulario(tarefa)

      // 2. Mudar o Label do Botão para Atualizar
      const btn_confirmar = document.getElementById("btn-confirmar")
      btn_confirmar.value = "Editar Tarefa"

      // 3. Salvar um Estado Global se está editando
      editing = true
      tarefa_id = tarefa.id
    }

    const btn_remover = document.createElement("a") // <a></a>
    btn_remover.innerText = "Remover" // <a>Editar</a>
    btn_remover.href = "#"
    const espaco = document.createElement("span")
    espaco.innerText = " "
    btn_remover.onclick = async (event) => {
      // alert(`Remover o Filme ${filme.nome}!!`)
      // chamar API método DELETE passando o ID URL
      event.preventDefault()
      const confirmou = confirm(`Deseja mesmo remover a Tarefa: ${tarefa.nome}`)

      if (!confirmou) {
        return
      }

      const opcoes = {
        method: "DELETE",
        headers: {
          Authorization: token
        }
      }

      const response = await fetch(baseURL + "/" + tarefa.id, opcoes)

      // se deu certo..
      if (response.ok) {
        alert("Tarefa excluida!")
        carregar_tarefas()
      }
    }

    item.innerText = label
    item.appendChild(btn_editar)
    item.appendChild(espaco)
    item.appendChild(btn_remover)

    ul_tarefa.appendChild(item)
  }
}

function preencher_formulario(tarefa) {
  const form_tarefa = document.getElementById("form-tarefa")

  const inputs = form_tarefa.children
  inputs[0].value = tarefa.descricao
  inputs[1].value = tarefa.responsavel
  inputs[2].value = tarefa.nivel
  inputs[3].value = tarefa.prioridade
  inputs[4].value = tarefa.situacao
}

async function carregar_tarefas() {
  console.log("Todas as Tarefas")

  const opcoes = {
    headers: {
      Authorization: token
    }
  }
  const response = await fetch(baseURL, opcoes)
  const status = response.status

  if (response.status === 200) {
    filmes = await response.json()
    atualizar_tela()
  } else {
    // const result = await response.json()
    alert(`Você não está autenticado!`)
    // redicionar para tela de login
    window.location.replace("login.html")
  }

  // console.log('Status', status)
  // console.log('Dados', dados)
}

function configurar_formulario() {
  const form_tarefa = document.getElementById("form-tarefa")
  const input_situacao = document.getElementById("situacao")

  const btn_cancelar = document.getElementById("btn-cancelar")

  btn_cancelar.onclick = () => {
    const btn_confirmar = document.getElementById("btn-confirmar")
    btn_confirmar.value = "Adicionar Tarefa"
  }

  form_tarefa.onsubmit = async function (event) {
    event.preventDefault()

    const dados = form_tarefa.children
    const descricao = dados[0].value
    const responsavel = dados[1].value
    const nivel = dados[2].value
    const prioridade = dados[3].value
    const situacao =  dados[4].value

    const tarefa = { descricao, responsavel, nivel, prioridade, situacao}

    console.log("Submeteu!!!")
    // console.log(dados)
    // console.log('Filme: ', filme)
    let url = baseURL
    let method = "POST"
    let mensagem_ok = "Tarefa Adicionada com sucesso!"
    let mensagem_erro = "Não foi possível adicionar"
    let response_status = 201

    if (editing) {
      url = baseURL + "/" + tarefa_id
      method = "PUT"
      mensagem_ok = "Tarefa Atualizada com sucesso!"
      mensagem_erro = "Não foi possível editar"
      response_status = 200
    }

    const opcoes = {
      method: method,
      body: JSON.stringify(tarefa),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    }

    const response = await fetch(url, opcoes)

    if (response.status === response_status) {
      alert(mensagem_ok)
      carregar_tarefas()
      resetar_formulario()
    } else {
      const result_data = await response.json()
      alert(`Erro: ${result_data["detail"]}`)
    }
  }
}

function app() {
  console.log("api - tarefas")
  show_current_user()
  configurar_formulario()
  carregar_tarefas()
}

async function show_current_user() {
  const url = "http://localhost:8000/auth/me"
  const user_label = document.getElementById("user")

  const opcoes = {
    headers: {
      Authorization: token
    }
  }
  const response = await fetch(url, opcoes)

  if (response.ok) {
    const result_data = await response.json()
    const primeiro_nome = result_data["nome"].split(" ")[0]
    user_label.innerText = `Olá ${primeiro_nome}!`
  }
}

function logout() {
  alert("Tchau!")
  localStorage.clear()
  window.location.replace("login.html")
}

app()

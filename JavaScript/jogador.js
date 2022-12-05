'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')
const openModal2 = () => document.getElementById('modal2').classList.add('active')
const openModal3 = () => document.getElementById('modal3').classList.add('active')

const closeModal3 = () => {
    document.getElementById('modal3').classList.remove('active')
}

const closeModal2 = () => {
    document.getElementById('modal2').classList.remove('active')
}

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_jogador')) ?? []
const setLocalStorage = (dbJogador) => localStorage.setItem("db_jogador", JSON.stringify(dbJogador))

// CRUD - create read update delete
const deleteJogador = (index) => {
    const dbJogador = readJogador()
    dbJogador.splice(index, 1)
    setLocalStorage(dbJogador)
}

const updateJogador = (index, jogador) => {
    const dbJogador = readJogador()
    dbJogador[index] = jogador
    setLocalStorage(dbJogador)
}

const readJogador = () => getLocalStorage()

const createJogador = (jogador) => {
    const dbJogador = getLocalStorage()
    dbJogador.push(jogador)
    setLocalStorage(dbJogador)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('cpf').dataset.index = 'new'
}

const saveJogador = () => {

    if (isValidFields()) {
        const jogador = {
            cpf: document.getElementById('cpf').value,
            nome: document.getElementById('nome').value,
            data: document.getElementById('data').value,
            sexo: document.getElementById('sexo').value,
            peso: document.getElementById('peso').value,
            altura: document.getElementById('altura').value,
            emails: document.getElementById('emails').value,
            telefones: document.getElementById('telefones').value,
            posicoes: document.getElementById('posicoes').value
        }
        const index = document.getElementById('cpf').dataset.index
        if (index == 'new') {
            createJogador(jogador)
            //updateTable()
            closeModal()
        } else {
            updateJogador(index, jogador)
            //updateTable()
            updateTableSearch(jogador, index)
            closeModal()
        }
    }
}

const createRow = (jogador, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${jogador.cpf}</td>
        <td>${jogador.nome}</td>
        <td>${jogador.data}</td>
        <td>${jogador.sexo}</td>
        <td>${jogador.peso}</td>
        <td>${jogador.altura}</td>
        <td>${jogador.emails}</td>
        <td>${jogador.telefones}</td>
        <td>${jogador.posicoes}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableJogador>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableJogador>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbJogador = readJogador()
    clearTable()
    dbJogador.forEach(createRow)
}

const fillFields = (jogador) => {
    document.getElementById('cpf').value = jogador.cpf
    document.getElementById('nome').value = jogador.nome
    document.getElementById('data').value = jogador.data
    document.getElementById('sexo').value = jogador.sexo
    document.getElementById('peso').value = jogador.peso
    document.getElementById('altura').value = jogador.altura
    document.getElementById('emails').value = jogador.emails
    document.getElementById('telefones').value = jogador.telefones
    document.getElementById('posicoes').value = jogador.posicoes
    document.getElementById('cpf').dataset.index = jogador.index
}

const editJogador = (index) => {
    const jogador = readJogador()[index]
    let nameModal = document.querySelector('#new-edit')
    nameModal.textContent = `Editando o Jogador ${jogador.nome}`
    jogador.index = index
    fillFields(jogador)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editJogador(index)
        } else {
            const jogador = readJogador()[index]
            let avisoDelete = document.querySelector('#avisoDelete')
            let namePlayer = document.querySelector('#delete-player')

            namePlayer.textContent = `Deletar o Jogador ${jogador.nome}`
            avisoDelete.textContent = `Deseja realmente excluir o jogador ${jogador.nome}`
            openModal2()

        // APAGAR O REGISTRO
            document.getElementById('apagar').addEventListener('click', () => {
                deleteJogador(index)
                updateTable()
                closeModal2()
            })
        }
    }
}

function returnMenu(){location.href = "https://wcristiansilva.github.io/trabalho2tc1/index.html"}

function listarJogadores() {updateTable()}

const listarJogador = (nome) => {
    const dbJogador = readJogador()
    dbJogador.find((player, index) => {
        if (player.nome.toLowerCase() === nome) {
            updateTableSearch(player, index)
        }
    })
}

const updateTableSearch = (equip, index) => {
    clearTable()
    createRow(equip, index)
}

const buscarJogador = () => {
    clearTable()
    document.querySelector('#input-busca').focus()
    openModal3()
    const btn = document.querySelector('#send').addEventListener('click', (e) => {
            e.preventDefault()
            const nome = document.querySelector('#input-busca').value.toLowerCase()
            listarJogador(nome)
            closeModal3()
        })
}

// updateTable()

// Eventos
document.getElementById('cadastrarJogador')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('modalClose2')
    .addEventListener('click', closeModal2)

// modal buscar
document.getElementById('modalClose3')
    .addEventListener('click', closeModal3)

document.getElementById('salvar')
    .addEventListener('click', saveJogador)

document.querySelector('#tableJogador>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('cancelar2')
    .addEventListener('click', closeModal2)

// return menu
document.getElementById('returnMenu')
    .addEventListener('click', returnMenu)

// Listar Jogadores
document.querySelector('#listarJogadores')
    .addEventListener('click', listarJogadores)

// Listar Jogador
document.querySelector('#listarJogador')
    .addEventListener('click', buscarJogador)
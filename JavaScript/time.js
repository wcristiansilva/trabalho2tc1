'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')
const openModal2 = () => document.getElementById('modal2').classList.add('active')
const openModal3 = () => document.getElementById('modal3').classList.add('active')


const closeModal3 = () => {
    clearFields()
    document.getElementById('modal3').classList.remove('active')
}

const closeModal2 = () => {
    document.getElementById('modal2').classList.remove('active')
}

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_Equip')) ?? []
const setLocalStorage = (dbEquip) => localStorage.setItem("db_Equip", JSON.stringify(dbEquip))

// CRUD - create read update delete
const deleteEquip = (index) => {
    const dbEquip = readEquip()
    dbEquip.splice(index, 1)
    setLocalStorage(dbEquip)
}

const updateEquip = (index, equip) => {
    const dbEquip = readEquip()
    dbEquip[index] = equip
    setLocalStorage(dbEquip)
}

const readEquip = () => getLocalStorage()

const createEquip = (equip) => {
    const dbEquip = getLocalStorage()
    dbEquip.push(equip)
    setLocalStorage(dbEquip)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('codigo').dataset.index = 'new'
}

const saveEquip = () => {

    if (isValidFields()) {
        const equip = {
            codigo: document.getElementById('codigo').value,
            nome: document.getElementById('nome').value,
            dataF: document.getElementById('dataF').value,
            logradouro: document.getElementById('logradouro').value,
            nro: document.getElementById('nro').value,
            cep: document.getElementById('cep').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            telefones: document.getElementById('telefones').value,
            fundadores: document.getElementById('fundadores').value
        }
        const index = document.getElementById('codigo').dataset.index
        if (index == 'new') {
            createEquip(equip)
            //updateTable()
            closeModal()
        } else {
            updateEquip(index, equip)
            // updateTable()
            updateTableSearch(equip, index)
            closeModal()
        }
    }
}

const createRow = (equip, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${equip.codigo}</td>
        <td>${equip.nome}</td>
        <td>${equip.dataF}</td>
        <td>${equip.logradouro}</td>
        <td>${equip.nro}</td>
        <td>${equip.cep}</td>
        <td>${equip.cidade}</td>
        <td>${equip.estado}</td>
        <td>${equip.telefones}</td>
        <td>${equip.fundadores}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableEquip>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableEquip>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbEquip = readEquip()
    clearTable()
    dbEquip.forEach(createRow)
}

const fillFields = (equip) => {
    document.getElementById('codigo').value = equip.codigo
    document.getElementById('nome').value = equip.nome
    document.getElementById('dataF').value = equip.dataF
    document.getElementById('logradouro').value = equip.logradouro
    document.getElementById('nro').value = equip.nro
    document.getElementById('cep').value = equip.cep
    document.getElementById('cidade').value = equip.cidade
    document.getElementById('estado').value = equip.estado
    document.getElementById('telefones').value = equip.telefones
    document.getElementById('fundadores').value = equip.fundadores
    document.getElementById('codigo').dataset.index = equip.index
}

const editEquip = (index) => {
    const equip = readEquip()[index]
    let nameModal = document.querySelector('#new-edit')
    nameModal.textContent = `Editando o Time ${equip.nome}`
    equip.index = index
    fillFields(equip)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        
        const [action, index] = event.target.id.split('-')
        
        if (action == 'edit') {
            editEquip(index)
        } else {
            const equip = readEquip()[index]
            let avisoDelete = document.querySelector('#avisoDelete')
            let nameEquip = document.querySelector('#delete-equip')
            
            nameEquip.textContent = `Deletar o Time ${equip.nome}`
            avisoDelete.textContent = `Deseja realmente excluir a equip ${equip.nome}`
            openModal2()
            
            // APAGAR O REGISTRO
            document.getElementById('apagar').addEventListener('click', () => {
                deleteEquip(index)
                // updateTable()
                updateTableSearch()
                closeModal2()
            })
        }
    }
}

const returnMenu = () => {location.href = "index.html"}

const listarTimes= () =>{updateTable()}

function listarTime (nome) {
    const dbEquip = readEquip()
    dbEquip.find((equip, index) => {
        if (equip.nome.toLowerCase() === nome) {
            updateTableSearch(equip, index)
        }
    })
}

const updateTableSearch = (equip, index) => {
    clearTable()
    createRow(equip, index)
}

const buscarTime = () => {
    document.querySelector('#input-busca').focus()
    openModal3()
    const btn = document.querySelector('#send')
        .addEventListener('click', (e) => {
            e.preventDefault()
            const nome = document.querySelector('#input-busca').value.toLowerCase()
            listarTime(nome)
            closeModal3()
        })
}

// updateTable()

// Eventos
document.getElementById('cadastrarTime')
    .addEventListener('click', openModal)

// modal cadastrar
document.getElementById('modalClose')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('modalClose2')
    .addEventListener('click', closeModal2)

// modal buscar
document.getElementById('modalClose3')
    .addEventListener('click', closeModal3)

document.getElementById('save')
    .addEventListener('click', saveEquip)

document.querySelector('#tableEquip>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

// modal apagar
document.getElementById('cancelar2')
    .addEventListener('click', closeModal2)

// return Menu
document.querySelector('#returnMenu')
    .addEventListener('click', returnMenu)

// Listar Times
document.querySelector('#listarTimes')
    .addEventListener('click', listarTimes)

// Listar Time
document.querySelector('#listarTime')
    .addEventListener('click', buscarTime)
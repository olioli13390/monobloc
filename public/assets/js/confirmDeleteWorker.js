let currentDeleteFormId = null;

function showDeleteModal(event, workerId) {
    event.preventDefault()
    currentDeleteFormId = 'deleteForm' + workerId
    document.getElementById('confirm-delete-modal').style.display = 'block'
    document.getElementById('overlay').style.display = 'block'
}

document.getElementById('cancel').addEventListener('click', function () {
    document.getElementById('confirm-delete-modal').style.display = 'none'
    document.getElementById('overlay').style.display = 'none'
});

document.getElementById('confirm-delete').addEventListener('click', function () {
    if (currentDeleteFormId) {
        document.getElementById(currentDeleteFormId).submit()
    }
});
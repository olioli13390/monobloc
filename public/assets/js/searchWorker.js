document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInputWorkers')
    const workersTableBody = document.getElementById('workers-table-body')
    const rows = workersTableBody.getElementsByTagName('tr')

    searchInput.addEventListener('keyup', function() {
        const searchTerm = searchInput.value.toLowerCase()

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const cells = row.getElementsByTagName('td')
            let matches = false

            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell) {
                    const text = cell.textContent.toLowerCase()
                    if (text.includes(searchTerm)) {
                        matches = true
                        break
                    }
                }
            }

            row.style.display = matches ? '' : 'none'
        }
    })
})


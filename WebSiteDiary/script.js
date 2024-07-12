document.addEventListener('DOMContentLoaded', function () {
    let isAuthor = false; // เปลี่ยนเป็น false เพื่อจำลองการไม่ใช่ผู้เขียน

    // Function to create a new diary entry
    function createDiaryEntry(entryText) {
        var newEntry = document.createElement('div');
        newEntry.className = 'diary-entry';

        var entryContent = document.createElement('div');
        entryContent.className = 'entry-content';
        entryContent.textContent = entryText;

        var entryDate = document.createElement('div');
        entryDate.className = 'entry-date';
        var now = new Date();
        entryDate.textContent = "เพิ่มเมื่อ: " + now.toLocaleString();

        var heartButton = document.createElement('button');
        heartButton.className = 'heart-button';
        heartButton.innerHTML = '❤';
        heartButton.onclick = function () {
            var heartCount = this.nextElementSibling;
            var count = parseInt(heartCount.textContent);
            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                heartCount.textContent = count + 1;
            } else {
                this.classList.add('liked');
                heartCount.textContent = count + 1;
            }
            saveEntriesToLocalStorage();
        };

        var heartCount = document.createElement('span');
        heartCount.className = 'heart-count';
        heartCount.textContent = '0';

        newEntry.appendChild(entryContent);
        newEntry.appendChild(entryDate);
        newEntry.appendChild(heartButton);
        newEntry.appendChild(heartCount);

        if (isAuthor) {
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'ลบ';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = function () {
                newEntry.remove();
                saveEntriesToLocalStorage();
            };
            newEntry.appendChild(deleteButton);
        }

        return newEntry;
    }

    // Function to save entries to localStorage
    function saveEntriesToLocalStorage() {
        var diaryEntries = document.getElementById('diary-entries').children;
        var entriesArray = [];
        for (var i = 0; i < diaryEntries.length; i++) {
            var entry = diaryEntries[i];
            var entryContent = entry.querySelector('.entry-content').textContent;
            var entryDate = entry.querySelector('.entry-date').textContent;
            var heartCount = entry.querySelector('.heart-count').textContent;
            var liked = entry.querySelector('.heart-button').classList.contains('liked');
            entriesArray.push({ content: entryContent, date: entryDate, hearts: heartCount, liked: liked });
        }
        localStorage.setItem('diaryEntries', JSON.stringify(entriesArray));
    }

    // Function to load entries from localStorage
    function loadEntriesFromLocalStorage() {
        var entries = localStorage.getItem('diaryEntries');
        if (entries) {
            var entriesArray = JSON.parse(entries);
            var diaryEntries = document.getElementById('diary-entries');
            entriesArray.forEach(function (entry) {
                var newEntry = createDiaryEntry(entry.content);
                newEntry.querySelector('.entry-date').textContent = entry.date;
                newEntry.querySelector('.heart-count').textContent = entry.hearts;
                if (entry.liked) {
                    newEntry.querySelector('.heart-button').classList.add('liked');
                }
                diaryEntries.appendChild(newEntry);
            });
        }
    }

    // Load entries when the page is loaded
    loadEntriesFromLocalStorage();

    // Show diary entries by default
    document.getElementById('diary-entries').style.display = 'block';
    document.getElementById('toggle-entries').textContent = 'ซ่อนไดอารี่ทั้งหมด';
    document.getElementById('toggle-entries').style.display = 'block';

    if (isAuthor) {
        document.getElementById('diary-form').style.display = 'block';
    } else {
        document.getElementById('diary-form').style.display = 'none';
    }

    document.getElementById('diary-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var entryText = document.getElementById('diary-entry').value;
        if (entryText.trim() !== "") {
            var diaryEntries = document.getElementById('diary-entries');
            var newEntry = createDiaryEntry(entryText);
            diaryEntries.appendChild(newEntry);
            document.getElementById('diary-entry').value = '';

            saveEntriesToLocalStorage();
        }
    });

    document.getElementById('toggle-entries').addEventListener('click', function () {
        var diaryEntries = document.getElementById('diary-entries');
        if (diaryEntries.style.display === 'none') {
            diaryEntries.style.display = 'block';
            this.textContent = 'ซ่อนไดอารี่ทั้งหมด';
        } else {
            diaryEntries.style.display = 'none';
            this.textContent = 'แสดงไดอารี่ทั้งหมด';
        }
    });
});

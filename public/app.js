$(document).ready(function() {
    console.log("DOM is ready"); // 追加して確認
  
    const csrfToken = $('meta[name="csrf-token"]').attr('content');
  
    // 比較する人を追加するボタンのクリックイベント
    $('#addComparisonUser').click(function() {
      console.log("比較する人を追加するボタンがクリックされました");
      $('#comparisonUserFields').append(`
        <div class="form-row">
          <div class="col-md-6 mb-3">
            <label for="comparisonName">比較したい人の名前</label>
            <input type="text" class="form-control" name="comparisonName[]" required>
          </div>
          <div class="col-md-6 mb-3">
            <label for="comparisonBirthYear">比較したい人の生まれ年</label>
            <input type="number" class="form-control" name="comparisonBirthYear[]" required>
          </div>
        </div>
      `);
    });

    // フォームの送信イベント
    $('#ageComparisonForm').on('submit', function(event) {
      event.preventDefault();
      const userName = $('#userName').val();
      const userBirthYear = $('#userBirthYear').val();
      const comparisonNames = $('input[name="comparisonName[]"]').map(function() { return $(this).val(); }).get();
      const comparisonBirthYears = $('input[name="comparisonBirthYear[]"]').map(function() { return $(this).val(); }).get();
  
      // テーブルの見出し部分の名前と生年を更新する
      let theadContent = `
        <th>西暦</th>
        <th>${userName} (${userBirthYear}年生まれ)</th>
      `;
      comparisonNames.forEach((name, index) => {
        theadContent += `<th>${name} (${comparisonBirthYears[index]}年生まれ)</th>`;
      });
      $('#ageComparisonTable thead tr').html(theadContent);
  
      $.ajax({
        url: '/api/create-age-table',
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': csrfToken
        },
        data: JSON.stringify({
          userName: userName,
          userBirthYear: userBirthYear,
          comparisonNames: comparisonNames,
          comparisonBirthYears: comparisonBirthYears
        }),
        success: function(data) {
          // Clear previous table rows
          $('#ageComparisonTable tbody').empty();
  
          // Add new rows for each age result
          for (let age = 0; age <= 100; age++) {
            const userYear = parseInt(userBirthYear) + age;
            let row = `<tr><td>${userYear}年</td><td>${age}歳</td>`;
            comparisonBirthYears.forEach(birthYear => {
              const comparisonAge = userYear - parseInt(birthYear);
              row += `<td>${comparisonAge}歳</td>`;
            });
            row += '</tr>';
            $('#ageComparisonTable tbody').append(row);
          }
        },
        error: function(xhr, status, error) {
          console.error('エラー:', error);
        }
      });
    });
  
    $('#saveTableBtn').on('click', function() {
      const tableName = $('#tableName').val();
      const tableData = $('#ageComparisonTable').html();
  
      $.ajax({
        url: '/api/save-table',
        method: 'POST',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': csrfToken
        },
        data: JSON.stringify({
          tableName: tableName,
          tableData: tableData
        }),
        success: function(response) {
          alert(response.message);
        },
        error: function(xhr, status, error) {
          console.error('エラー:', error);
        }
      });
    });
  });
  
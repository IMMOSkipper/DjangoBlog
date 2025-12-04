$(document).ready(function() {
    // 搜索历史相关函数
    function getSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    function saveSearchHistory(keyword) {
        var history = getSearchHistory();
        // 移除已存在的相同关键词
        history = history.filter(function(item) {
            return item !== keyword;
        });
        // 添加到历史记录开头
        history.unshift(keyword);
        // 最多保存10条历史记录
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    function clearSearchHistory() {
        localStorage.removeItem('searchHistory');
        $('#search-history').hide();
    }

    function renderSearchHistory() {
        var history = getSearchHistory();
        var $history = $('#search-history');
        var $list = $history.find('.history-list');

        if (history.length === 0) {
            $history.hide();
            return;
        }

        $list.empty();
        for (var i = 0; i < history.length; i++) {
            var keyword = history[i];
            var $item = $('<li class="history-item"><a href="#">' + keyword + '</a><span class="delete-history">&times;</span></li>');
            $list.append($item);
        }

        $history.show();
    }

    // 搜索提示相关函数
    function getSearchSuggestions(keyword) {
        // 这里可以替换为实际的后端API请求
        var suggestions = ['Django', 'Python', 'JavaScript', 'HTML', 'CSS', '前端开发', '后端开发', '全栈开发', '技术博客', '编程教程'];
        return suggestions.filter(function(suggestion) {
            return suggestion.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
        });
    }

    function renderSearchSuggestions(suggestions) {
        var $suggestions = $('#search-suggestions');
        var $list = $suggestions.find('.suggestions-list');

        if (suggestions.length === 0) {
            $suggestions.hide();
            return;
        }

        $list.empty();
        for (var i = 0; i < suggestions.length; i++) {
            var suggestion = suggestions[i];
            var $item = $('<li class="suggestion-item"><a href="#">' + suggestion + '</a></li>');
            $list.append($item);
        }

        $suggestions.show();
    }

    // 初始化搜索框
    var $searchForm = $('#searchform');
    var $searchInput = $('#q');
    var $searchSubmit = $('#searchsubmit');

    // 添加搜索历史和提示容器
    $searchForm.append('<div id="search-dropdown"><div id="search-suggestions"><ul class="suggestions-list"></ul></div><div id="search-history"><div class="history-header"><span>搜索历史</span><a href="#" id="clear-history">清除</a></div><ul class="history-list"></ul></div></div>');

    // 搜索输入框事件
    $searchInput.on('input', function() {
        var keyword = $(this).val().trim();

        if (keyword === '') {
            $('#search-suggestions').hide();
            renderSearchHistory();
            return;
        }

        var suggestions = getSearchSuggestions(keyword);
        renderSearchSuggestions(suggestions);
        $('#search-history').hide();
    });

    // 搜索输入框焦点事件
    $searchInput.on('focus', function() {
        var keyword = $(this).val().trim();

        if (keyword === '') {
            renderSearchHistory();
        } else {
            var suggestions = getSearchSuggestions(keyword);
            renderSearchSuggestions(suggestions);
        }
    });

    // 点击页面其他地方隐藏搜索下拉框
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#searchform').length) {
            $('#search-dropdown').hide();
        }
    });

    // 搜索输入框点击事件（显示下拉框）
    $searchInput.on('click', function(e) {
        e.stopPropagation();
        var keyword = $(this).val().trim();

        if (keyword === '') {
            renderSearchHistory();
        } else {
            var suggestions = getSearchSuggestions(keyword);
            renderSearchSuggestions(suggestions);
        }
        $('#search-dropdown').show();
    });

    // 搜索建议项点击事件
    $(document).on('click', '.suggestion-item a', function(e) {
        e.preventDefault();
        var keyword = $(this).text();
        $searchInput.val(keyword);
        saveSearchHistory(keyword);
        $('#search-dropdown').hide();
        $searchForm.submit();
    });

    // 搜索历史项点击事件
    $(document).on('click', '.history-item a', function(e) {
        e.preventDefault();
        var keyword = $(this).text();
        $searchInput.val(keyword);
        $('#search-dropdown').hide();
        $searchForm.submit();
    });

    // 删除搜索历史项
    $(document).on('click', '.delete-history', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var keyword = $(this).siblings('a').text();
        var history = getSearchHistory();
        history = history.filter(function(item) {
            return item !== keyword;
        });
        localStorage.setItem('searchHistory', JSON.stringify(history));
        renderSearchHistory();
    });

    // 清除所有搜索历史
    $(document).on('click', '#clear-history', function(e) {
        e.preventDefault();
        clearSearchHistory();
    });

    // 搜索表单提交事件
    $searchForm.on('submit', function(e) {
        var keyword = $searchInput.val().trim();
        if (keyword !== '') {
            saveSearchHistory(keyword);
        }
    });
});
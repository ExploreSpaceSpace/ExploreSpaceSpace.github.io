// 加载
document.body.style.overflow = 'hidden'; // 隐藏滚动
$(window).on('load', function() { // 加载完毕
  $('.loader-wrapper').fadeOut("slow"); // 隐藏加载动画
  document.body.style.overflow = 'auto'; // 显示滚动
});

// 获取
document.addEventListener('DOMContentLoaded', function() {
  loadGitHubData();
});

// GitHub API获取
async function loadGitHubData() {
  // const username = 'ExploreSpaceSpace'; // 访问次数限制1h内60次 测试用 上传时记得改回去
  const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

  // 加载中
  setLoadingState(true);

  try {
      const response = await fetch(reposUrl);

      if (!response.ok) {
          throw new Error(`GitHub API错误: ${response.status}`);
      }

      const repos = await response.json();

      // 计算
      let totalStars = 0;

      repos.forEach(repo => {
          totalStars += repo.stargazers_count;
      });

      // 更新DOM
      document.getElementById('stat-repos').textContent = repos.length; // 仓库数
      document.getElementById('stat-stars').textContent = totalStars; // 星标数

      // 移除加载状态
      setLoadingState(false);

  } catch (error) {
      console.error('获取GitHub数据失败:', error);

      // 显示错误信息
      document.getElementById('stat-repos').textContent = '获取失败';
      document.getElementById('stat-repos').classList.add('error');

      document.getElementById('stat-stars').textContent = '获取失败';
      document.getElementById('stat-stars').classList.add('error');

      setLoadingState(false);
  }
}

// 设置加载状态
function setLoadingState(isLoading) {
  const stats = document.querySelectorAll('.stat-number');

  stats.forEach(stat => {
      if (isLoading) {
          stat.classList.add('loading');
      } else {
          stat.classList.remove('loading');
          stat.classList.remove('error');
      }
  });
}

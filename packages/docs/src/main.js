import pagination from '@lucasmogari/pagination';

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const tabName = button.dataset.tab;

    // Remove active class from all buttons and panes
    document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.remove('active'));

    // Add active class to clicked button and corresponding pane
    button.classList.add('active');
    const pane = document.getElementById(tabName);
    if (pane) {
      pane.classList.add('active');
    }
  });
});

// Render pagination demo
function renderPaginationDemo(containerId, page, totalItems, options) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  pagination(
    page,
    totalItems,
    (item) => {
      const button = document.createElement('button');

      if (item.type === 'gap') {
        button.className = 'gap';
        button.textContent = '...';
        button.disabled = true;
      } else if (item.type === 'previous') {
        button.textContent = '←';
        button.disabled = !item.page;
        if (item.page) {
          button.onclick = () => renderPaginationDemo(containerId, item.page, totalItems, options);
        }
      } else if (item.type === 'next') {
        button.textContent = '→';
        button.disabled = !item.page;
        if (item.page) {
          button.onclick = () => renderPaginationDemo(containerId, item.page, totalItems, options);
        }
      } else if (item.type === 'first') {
        button.textContent = '«';
        if (item.page) {
          button.onclick = () => renderPaginationDemo(containerId, item.page, totalItems, options);
        }
        button.disabled = item.current;
      } else if (item.type === 'last') {
        button.textContent = '»';
        if (item.page) {
          button.onclick = () => renderPaginationDemo(containerId, item.page, totalItems, options);
        }
        button.disabled = item.current;
      } else {
        button.textContent = item.page;
        if (item.current) {
          button.classList.add('active');
        }
        button.onclick = () => renderPaginationDemo(containerId, item.page, totalItems, options);
      }

      container.appendChild(button);
    },
    options,
  );
}

// Initialize demos
renderPaginationDemo('demo-minimal', 5, 100, {
  itemsPerPage: 10,
  maxPageItems: 5,
  numbers: true,
  arrows: true,
  first: false,
  last: false,
});

renderPaginationDemo('demo-full', 5, 100, {
  itemsPerPage: 10,
  maxPageItems: 7,
  numbers: true,
  arrows: true,
  first: true,
  last: true,
});

renderPaginationDemo('demo-large', 50, 1000, {
  itemsPerPage: 10,
  maxPageItems: 9,
  numbers: true,
  arrows: true,
  first: true,
  last: true,
});

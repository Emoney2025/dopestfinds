
const fallbackProducts = [{"name": "Mini Portable Projector", "category": "Tech", "emoji": "\ud83d\udcfd\ufe0f", "badge": "Trending", "badgeClass": "pink", "url": "#"}, {"name": "Air Fryer", "category": "Kitchen", "emoji": "\ud83c\udf5f", "badge": "Best Seller", "badgeClass": "green", "url": "#"}, {"name": "Wireless Earbuds", "category": "Tech", "emoji": "\ud83c\udfa7", "badge": "Popular", "badgeClass": "blue", "url": "#"}, {"name": "Insulated Tumbler", "category": "Home", "emoji": "\ud83e\udd64", "badge": "Hot", "badgeClass": "orange", "url": "#"}, {"name": "Massage Gun", "category": "Fitness", "emoji": "\ud83d\udc86", "badge": "New", "badgeClass": "purple", "url": "#"}, {"name": "Robot Vacuum", "category": "Home", "emoji": "\ud83e\udd16", "badge": "Top Rated", "badgeClass": "green", "url": "#"}, {"name": "Vegetable Chopper", "category": "Kitchen", "emoji": "\ud83e\udd55", "badge": "Trending", "badgeClass": "pink", "url": "#"}, {"name": "Adjustable Dumbbells", "category": "Fitness", "emoji": "\ud83c\udfcb\ufe0f", "badge": "Popular", "badgeClass": "blue", "url": "#"}];
let state={products:fallbackProducts, category:"All", query:""};

const grid=document.getElementById("productsGrid");
const filters=document.getElementById("categoryFilters");
const search=document.getElementById("searchInput");
const empty=document.getElementById("emptyState");

document.getElementById("year").textContent=new Date().getFullYear();

function esc(v="") {
  return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function buildFilters() {
  const cats=["All",...new Set(state.products.map(p=>p.category).filter(Boolean))];
  filters.innerHTML=cats.map(c=>`<button class="chip ${c===state.category?"active":""}" data-category="${esc(c)}">${esc(c)}</button>`).join("");
  filters.querySelectorAll(".chip").forEach(btn=>btn.addEventListener("click",()=>{
    state.category=btn.dataset.category;
    buildFilters();
    render();
  }));
}

function render() {
  const q=state.query.toLowerCase().trim();
  const list=state.products.filter(p=>{
    const matchesCategory=state.category==="All"||p.category===state.category;
    const text=`${p.name} ${p.category}`.toLowerCase();
    return matchesCategory && (!q || text.includes(q));
  });
  empty.hidden=list.length>0;
  grid.innerHTML=list.map(p=>`
    <article class="card">
      <div class="imagearea">
        <span class="badge ${esc(p.badgeClass||"blue")}">${esc(p.badge||"Find")}</span>
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" style="width:100%;height:100%;object-fit:contain;padding:16px">`
                   : `<div class="productemoji">${esc(p.emoji||"🔥")}</div>`}
      </div>
      <div class="cardbody">
        <div class="category">${esc(p.category||"Find")}</div>
        <div class="productname">${esc(p.name)}</div>
        <a class="amazonbtn" href="${esc(p.url||"#")}" target="_blank" rel="nofollow sponsored noopener">View on Amazon →</a>
      </div>
    </article>
  `).join("");
}

search.addEventListener("input",e=>{state.query=e.target.value;render();});
document.getElementById("searchBtn").addEventListener("click",render);
document.getElementById("viewAllBtn").addEventListener("click",()=>{state.category="All";state.query="";search.value="";buildFilters();render();});

async function init(){
  try{
    const r=await fetch("products.json",{cache:"no-store"});
    if(r.ok){
      const data=await r.json();
      if(Array.isArray(data)&&data.length) state.products=data;
    }
  }catch(e){}
  buildFilters();
  render();
}
init();

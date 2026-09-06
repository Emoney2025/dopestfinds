
const state={products:[],category:"All",query:""};
const grid=document.getElementById("productsGrid"),filters=document.getElementById("categoryFilters"),search=document.getElementById("searchInput"),count=document.getElementById("productCount"),empty=document.getElementById("emptyState");
document.getElementById("year").textContent=new Date().getFullYear();

async function loadProducts(){
  const r=await fetch("products.json",{cache:"no-store"});
  state.products=await r.json();
  buildFilters();render();
}
function buildFilters(){
  const cats=["All",...new Set(state.products.map(p=>p.category).filter(Boolean))];
  filters.innerHTML=cats.map(c=>`<button class="filter ${c===state.category?"active":""}" data-category="${esc(c)}">${esc(c)}</button>`).join("");
  filters.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{state.category=b.dataset.category;buildFilters();render();});
}
function render(){
  const q=state.query.trim().toLowerCase();
  const items=state.products.filter(p=>{
    const cat=state.category==="All"||p.category===state.category;
    const hay=`${p.name} ${p.category} ${p.description||""} ${(p.tags||[]).join(" ")}`.toLowerCase();
    return cat&&(!q||hay.includes(q));
  });
  count.textContent=state.products.length;empty.hidden=items.length!==0;
  grid.innerHTML=items.map(p=>`
    <article class="product-card">
      <div class="product-image">
        ${p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`:`<div class="product-placeholder">${esc(p.emoji||"🔥")}</div>`}
        ${p.badge?`<div class="product-tag">${esc(p.badge)}</div>`:""}
      </div>
      <div class="product-body">
        <div class="product-category">${esc(p.category||"Find")}</div>
        <div class="product-title">${esc(p.name)}</div>
        <div class="product-desc">${esc(p.description||"")}</div>
        <a class="product-link" href="${esc(p.url)}" target="_blank" rel="nofollow sponsored noopener">View Product ↗</a>
      </div>
    </article>`).join("");
}
search.addEventListener("input",e=>{state.query=e.target.value;render();});
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
loadProducts().catch(()=>grid.innerHTML='<p style="color:#aaa">Could not load products.</p>');

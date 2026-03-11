    const state = {
        base: { name: 'إسبريسو', price: 15, color: '#3e2723' },
        milk: { name: 'كامل الدسم', price: 0 },
        temp: { name: 'حار', price: 0 },
        flavor: { name: 'سادة', price: 0, color: 'transparent' },
        extra: { name: 'بدون', price: 0 }
    };

    function updateApp() {
        // تحديث النصوص
        document.getElementById('sum-base').innerText = state.base.name;
        document.getElementById('sum-milk').innerText = state.milk.name;
        document.getElementById('sum-temp').innerText = state.temp.name;
        document.getElementById('sum-flavor').innerText = state.flavor.name;
        document.getElementById('sum-extra').innerText = state.extra.name;

        // حساب السعر
        const total = state.base.price + state.milk.price + state.temp.price + state.flavor.price + state.extra.price;
        document.getElementById('total-price').innerText = `${total} ر.س`;

        // تحديث الكوب
        const lBase = document.getElementById('layer-base');
        const lMilk = document.getElementById('layer-milk');
        const lFlavor = document.getElementById('layer-flavor');
        const lFoam = document.getElementById('layer-foam');
        const ice = document.getElementById('ice-container');

        lBase.style.backgroundColor = state.base.color;
        
        // الثلج
        ice.style.display = state.temp.name.includes('بارد') ? 'flex' : 'none';

        // الحليب
        if (state.milk.name === 'بدون حليب') {
            lMilk.style.height = '0';
        } else {
            lMilk.style.height = '35%';
            // إذا كانت هناك نكهة ممزوجة (اختياري) نغير لون الحليب قليلاً
            lMilk.style.backgroundColor = (state.flavor.name !== 'سادة' && state.flavor.color !== 'transparent') 
                ? state.flavor.color + '80'  // شفافية 50% 
                : '#fffde7';
        }

        // النكهة (سيروب)
        if (state.flavor.name !== 'سادة') {
            lFlavor.style.height = '10px';
            lFlavor.style.backgroundColor = state.flavor.color;
        } else {
            lFlavor.style.height = '0';
        }

        // الرغوة والكريمة
        if (state.extra.name === 'رغوة مكثفة') {
            lFoam.style.height = '15%';
            lFoam.style.backgroundColor = '#fff';
        } else if (state.extra.name === 'كريمة مخفوقة') {
            lFoam.style.height = '25%';
            lFoam.style.backgroundColor = '#fdf5e6';
        } else if (state.extra.name === 'صوص شوكولاتة') {
            lFoam.style.height = '8%';
            lFoam.style.backgroundColor = '#4e2e1e';
        } else {
            lFoam.style.height = '0';
        }
    }

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const type = this.dataset.type;
            const name = this.dataset.name;
            const price = parseInt(this.dataset.price || 0);
            const color = this.dataset.color;

            if (type === 'extra') {
                // للإضافات: نزيل active من كل الكروت في نفس المجموعة ثم ننشط هذا
                this.parentElement.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                state[type] = { name, price, color };
            } else {
                // باقي الأنواع
                this.parentElement.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                state[type] = { name, price, color: color || (state[type] ? state[type].color : null) };
            }

            updateApp();
        });
    });

    updateApp();

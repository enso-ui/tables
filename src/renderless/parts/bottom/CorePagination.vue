<script>
export default {
    name: 'CorePagination',

    inject: ['state', 'fetch'],

    computed: {
        page() {
            return (this.state.meta.start / this.state.meta.length) + 1;
        },
        pages() {
            return Math.ceil(this.state.body.filtered / this.state.meta.length);
        },
        atStart() {
            return this.page < 4;
        },
        atEnd() {
            return this.pages - this.page < 3;
        },
        middlePages() {
            const pages = [];

            if (this.atStart) {
                const max = Math.min(this.pages - 1, 4);
                for (let i = 2; i <= max; i++) {
                    pages.push(i);
                }

                return pages;
            }

            if (this.atEnd) {
                if (pages > 4) {
                    pages.push(this.pages - 3);
                }

                pages.push(this.pages - 2, this.pages - 1);
                return pages;
            }

            pages.push(this.page - 1, this.page, this.page + 1);

            return pages;
        },
    },

    methods: {
        jumpTo(page) {
            if (page === this.page || page < 1 || page > this.pages) {
                return;
            }

            this.state.meta.start = (page - 1) * this.state.meta.length;

            this.fetch();
        },
    },

    render() {
        return this.$scopedSlots.default({
            jumpTo: this.jumpTo,
            atStart: this.atStart,
            middlePages: this.middlePages,
            atEnd: this.atEnd,
            page: this.page,
            pages: this.pages,
        });
    },
};
</script>

import {
    faArrowsRotate,
    faBan,
    faCheck,
    faChevronRight,
    faCircleInfo,
    faCloudDownloadAlt,
    faEye,
    faFileExcel,
    faFilter,
    faGears,
    faPen,
    faPlus,
    faRotateLeft,
    faSearch,
    faSort,
    faSortDown,
    faSortUp,
    faTable,
    faTrashAlt,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

const icons = {
    'arrows-rotate': faArrowsRotate,
    ban: faBan,
    check: faCheck,
    'chevron-right': faChevronRight,
    'circle-info': faCircleInfo,
    'cloud-download-alt': faCloudDownloadAlt,
    download: faCloudDownloadAlt,
    eye: faEye,
    'file-excel': faFileExcel,
    filter: faFilter,
    gears: faGears,
    pen: faPen,
    plus: faPlus,
    'rotate-left': faRotateLeft,
    undo: faRotateLeft,
    search: faSearch,
    sort: faSort,
    'sort-down': faSortDown,
    'sort-up': faSortUp,
    table: faTable,
    'trash-alt': faTrashAlt,
    'trash-can': faTrashAlt,
    times: faXmark,
    xmark: faXmark,
};

const icon = value => (typeof value === 'string'
    ? icons[value] ?? value
    : value);

export { icon };

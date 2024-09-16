import { ListService, PagedResultDto } from '@abp/ng.core';
import { Component , ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { BookService, BookDto, bookTypeOptions } from '@proxy/books';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateNativeAdapter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, Confirmation } from '@abp/ng.theme.shared';
import { ChildPageComponent } from '../child-page/child-page.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [ListService, { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }],
})

export class BookComponent  {
  @ViewChild('childContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  book = { items: [], totalCount: 0 } as PagedResultDto<BookDto>;
  private childPage: ChildPageComponent;
  selectedBook = {} as BookDto; // declare selectedBook
  form: FormGroup;
  bookTypes = bookTypeOptions;
  isModalOpen = false;
  inputName = 'xxxxxx';
  showChild = false;

  constructor(
    public readonly list: ListService,
    private bookService: BookService,
    private fb: FormBuilder,
    private resolver: ComponentFactoryResolver,
    private confirmation: ConfirmationService // inject the ConfirmationService
  ) {}

  ngOnInit() {
    const bookStreamCreator = (query) => this.bookService.getList(query);
    this.list.hookToQuery(bookStreamCreator).subscribe((response) => {
      this.book = response;
    });
  }
  createBook() {
    this.selectedBook = {} as BookDto; // reset the selected book
    this.buildForm();
    this.isModalOpen = true;
  }
  editBook(id: string) {
    this.bookService.get(id).subscribe((book) => {
      this.selectedBook = book;
      this.buildForm();
      this.isModalOpen = true;
    });
  }
  delete(id: string) {
    this.confirmation.warn('::AreYouSureToDelete', '::AreYouSure').subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.bookService.delete(id).subscribe(() => this.list.get());
      }
    });
  }
  buildForm() {
    this.form = this.fb.group({
      name: [this.selectedBook.name || '', Validators.required],
      type: [this.selectedBook.type || null, Validators.required],
      publishDate: [
        this.selectedBook.publishDate ? new Date(this.selectedBook.publishDate) : null,
        Validators.required,
      ],
      price: [this.selectedBook.price || null, Validators.required],
    });
  }

  // change the save method
  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.selectedBook.id
      ? this.bookService.update(this.selectedBook.id, this.form.value)
      : this.bookService.create(this.form.value);

    request.subscribe(() => {
      this.isModalOpen = false;
      this.form.reset();
      this.list.get();
    });
  }
  loadChild()
  { 
    //aaaaaaaaaaaaaaas
    //  this.inputName = '传递给子页面的数据'; 
     this.showChild = true;
     this.container.clear(); // 清除之前加载的组件（如果有）
     const factory = this.resolver.resolveComponentFactory(ChildPageComponent);
     const componentRef = this.container.createComponent(factory);
     componentRef.instance.Name = '传递给子页面的数据';
  }
}

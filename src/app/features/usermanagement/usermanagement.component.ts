import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { UsermanagementService } from 'src/app/features/usermanagement/usermanagement.service';
import { UserManagementDto } from 'src/app/features/usermanagement/user-management-dto';
import { UserDto } from 'src/app/core/types/dto/user-dto';
import { RoleDto } from 'src/app/core/types/dto/roleDto';
import { TableModule } from 'primeng/table';
import { FormsModule, NgModel } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CommonService } from 'src/app/shared/services/common.service';
import { AppRoles } from 'src/app/shared/types/enums';
import { RemoveUserDto } from 'src/app/features/usermanagement/remove-dto';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'esa-usermanagement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    TableModule,
    InputTextModule,
    KeyFilterModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class UsermanagementComponent implements OnInit {
  tabs: { title: RoleDto; content: UserDto[] }[] = [];
  cols!: Column[];
  employeeIdInput: any;
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  @ViewChild('employeeIdTxt') employeeIdTxt: NgModel | undefined;

  constructor(
    private service: UsermanagementService,
    private commonService: CommonService
  ) {}

  async ngOnInit() {
    this.service.loadDataAsync().then((response) => {
      if (response.isSuccess && response.data != null) {
        const userManagementList: UserManagementDto[] = response.data;
        for (const mgt of userManagementList) {
          if (mgt?.role.name === AppRoles.DefaulRole) continue;
          this.tabs.push({
            title: mgt?.role!,
            content: mgt?.users!,
          });
        }
        this.tabs = this.tabs.filter(item => item.title.displayName !== "Employee");
      } else {
        this.commonService.notify('Load data', response.error!, 'error');
      }
    });

    this.cols = [
      { field: 'employeeId', header: 'Employee Id' },
      { field: 'userName', header: 'Employee Name' },
      { field: 'department', header: 'Department' },
    ];
  }

  addUser(roleId: string) {
    if (!this.employeeIdInput && this.employeeIdInput == '') {
      this.commonService.notify(
        'Employee Id',
        'Please enter employee Id to add.',
        'error'
      );
      return;
    }
    if (!this.emailPattern.test(this.employeeIdInput)) {
      this.commonService.notify(
        'Employee Id',
        'Please enter a valid email-id',
        'error'
      );
      return;
    }
    this.service
      .addUserToRoleAsync(roleId, this.employeeIdInput.trim()!)
      .then((response) => {
        if (response.isSuccess) {
          const user: UserDto = response.data!;
          const matchingTab = this.tabs.find(
            (item) => item.title.id === roleId
          );

          if (matchingTab) {
            matchingTab.content.push({
              accountId: user.accountId,
              department: user.department,
              employeeId: user.employeeId,
              userName: user.userName,
              id: user.id,
            });
            this.commonService.notify('Add user', 'User added', 'success');
          }
        }
      });
  }

  askConsentRemoveUser(roleId: string, userId: string) {
    this.commonService.askConsent(
      'Are you sure !',
      'Do you really want to remove the user?',
      () => {
        this.removeUser(roleId, userId);
      }
    );
  }

  removeUser(roleId: string, userId: string) {
    this.service.removeUser(roleId, userId).then((response) => {
      if (response.isSuccess) {
        const user: RemoveUserDto = response.data!;
        const matchingTab = this.tabs.find(
          (item) => item.title.id === user.roleId
        );

        if (matchingTab) {
          matchingTab.content = matchingTab.content.filter(
            (x) => x.id != user.userId
          );
          this.commonService.notify('Remove user', 'User removed', 'success');
        } else {
          this.commonService.notify(
            'Remove User',
            `Failed to remove user: ${response.error}`,
            'error'
          );
        }
      }
    });
  }

  activeTabIndexChanged(tab: any) {

    if (tab == null || tab === undefined || tab === "") {

      location.reload();

    }

     this.employeeIdInput = '';

  this.employeeIdTxt?.control.reset();

 

  }
}

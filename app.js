/**
 * App Logic
 * CRUD Operations using jQuery
 */

$(document).ready(function() {
    // State management
    let users = [
        { id: generateId(), firstName: 'Emma', lastName: 'Watson', email: 'emma@example.com', role: 'Admin' },
        { id: generateId(), firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'Editor' },
        { id: generateId(), firstName: 'Sarah', lastName: 'Connor', email: 'sarah.c@example.com', role: 'Viewer' }
    ];
    let isEditing = false;
    let editId = null;

    // Initial Render
    renderTable(users);

    // Form Submission (Create & Update)
    $('#userForm').on('submit', function(e) {
        e.preventDefault();
        
        // Gather form data
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();
        const role = $('#role').val();
        
        if(isEditing) {
            // Update operation
            const userIndex = users.findIndex(u => u.id === editId);
            if(userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], firstName, lastName, email, role };
                showNotification('User updated successfully!', 'success');
            }
        } else {
            // Create operation
            const newUser = {
                id: generateId(),
                firstName,
                lastName,
                email,
                role
            };
            users.push(newUser);
            showNotification('New user added successfully!', 'success');
        }
        
        // Reset form and UI state
        resetForm();
        renderTable(users);
    });

    // Delete User
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        if(confirm('Are you sure you want to delete this user?')) {
            users = users.filter(u => u.id !== id);
            renderTable(users);
            showNotification('User deleted successfully!', 'info');
        }
    });

    // Edit User
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const user = users.find(u => u.id === id);
        
        if(user) {
            // Populate form
            $('#firstName').val(user.firstName);
            $('#lastName').val(user.lastName);
            $('#email').val(user.email);
            $('#role').val(user.role);
            
            // Update UI state
            isEditing = true;
            editId = user.id;
            
            $('#formTitle span').text('Edit User');
            $('#formTitle i').removeClass('fa-user-plus').addClass('fa-user-pen text-warning');
            
            $('#saveBtn').html('<i class="fa-solid fa-check me-2"></i> Update User').removeClass('btn-primary').addClass('btn-warning text-dark');
            $('#cancelBtn').removeClass('d-none');
            
            // Scroll to form smoothly if on mobile
            if(window.innerWidth < 992) {
                $('html, body').animate({
                    scrollTop: $(".content-wrapper").offset().top - 20
                }, 500);
            }
        }
    });

    // Cancel Edit
    $('#cancelBtn').on('click', function() {
        resetForm();
    });

    // Search / Filter
    $('#searchInput').on('input', function() {
        const term = $(this).val().toLowerCase();
        const filteredUsers = users.filter(u => 
            u.firstName.toLowerCase().includes(term) || 
            u.lastName.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.role.toLowerCase().includes(term)
        );
        renderTable(filteredUsers);
    });

    // --- Helper Functions ---

    function renderTable(data) {
        const tbody = $('#userTableBody');
        tbody.empty();
        
        if(data.length === 0) {
            $('#emptyState').removeClass('d-none');
            $('.table-responsive').addClass('d-none');
        } else {
            $('#emptyState').addClass('d-none');
            $('.table-responsive').removeClass('d-none');
            
            data.forEach((user, index) => {
                // Determine styling based on data
                const roleClass = user.role === 'Admin' ? 'role-admin' : (user.role === 'Editor' ? 'role-editor' : 'role-viewer');
                const avatarColorClass = `avatar-color-${(index % 4) + 1}`;
                const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
                
                // Build row
                const tr = `
                    <tr class="row-enter" style="animation-delay: ${index * 0.05}s">
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="user-avatar ${avatarColorClass}">
                                    ${initials}
                                </div>
                                <div>
                                    <div class="fw-bold">${user.firstName} ${user.lastName}</div>
                                </div>
                            </div>
                        </td>
                        <td class="text-muted">${user.email}</td>
                        <td>
                            <span class="badge-role ${roleClass}">${user.role}</span>
                        </td>
                        <td class="text-end">
                            <button class="btn btn-outline-light btn-icon edit-btn me-2" data-id="${user.id}" title="Edit User">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-icon delete-btn" data-id="${user.id}" title="Delete User">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(tr);
            });
        }
    }

    function resetForm() {
        $('#userForm')[0].reset();
        isEditing = false;
        editId = null;
        
        // Reset UI
        $('#formTitle span').text('Add New User');
        $('#formTitle i').removeClass('fa-user-pen text-warning').addClass('fa-user-plus text-primary');
        
        $('#saveBtn').html('<i class="fa-solid fa-paper-plane me-2"></i> Save User').removeClass('btn-warning text-dark').addClass('btn-primary');
        $('#cancelBtn').addClass('d-none');
    }

    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    // Simple custom notification (since we are not using a heavy library for this)
    function showNotification(message, type) {
        const bg = type === 'success' ? 'bg-success' : 'bg-info';
        const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
        
        const toastId = 'toast-' + generateId();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white ${bg} border-0 position-fixed top-0 end-0 m-4" role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 1050; min-width: 250px;">
                <div class="d-flex">
                    <div class="toast-body d-flex align-items-center gap-2 fs-6">
                        <i class="fa-solid ${icon}"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        $('body').append(toastHtml);
        const toastEl = new bootstrap.Toast(document.getElementById(toastId), { delay: 3000 });
        toastEl.show();
        
        // Cleanup after hidden
        $(`#${toastId}`).on('hidden.bs.toast', function () {
            $(this).remove();
        });
    }
});
